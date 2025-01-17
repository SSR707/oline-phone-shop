import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderProductDto } from './dto/create-order-product.dto';
import { UpdateOrderProductDto } from './dto/update-order-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProduct } from './entities/order-product.entity';
import { Repository } from 'typeorm';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Product } from 'src/product/entities/product.entity';
import { Order } from 'src/order/entities/order.entity';
import { ProductService } from 'src/product/product.service';
import { Product_enum } from 'src/common/enums/enums';

@Injectable()
export class OrderProductService {
  constructor(
    @InjectRepository(OrderProduct)
    private orderProductRepository: Repository<OrderProduct>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRedis() private readonly redis: Redis,
  ) {}
  async create(createOrderProductDto: CreateOrderProductDto) {
    const order = await this.orderRepository.findOne({
      where: { id: createOrderProductDto.orderId },
    });
    const product = await this.productRepository.findOne({
      where: { id: createOrderProductDto.productId },
    });

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.BAD_REQUEST);
    }

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.BAD_REQUEST);
    }
    await this.productRepository.update(product , {status:Product_enum.SOLD})
    const orderProduct = this.orderProductRepository.create({
      order: { id: createOrderProductDto.orderId },
      product: { id: createOrderProductDto.productId },
    });

    const result = await this.orderProductRepository.save(orderProduct);
    await this.redis.set(String(result.id), JSON.stringify(result));
    return { status: HttpStatus.CREATED, message: 'Created' };
  }

  async findAll(page: number, limit: number, search: string) {
    const offset = (page - 1) * limit;
    let redisKey = `orderProducts_${page}_${limit}_${search}`;

    const redisData = await this.redis.get(redisKey);
    if (redisData) {
      return JSON.parse(redisData);
    } else {
      let query =
        this.orderProductRepository.createQueryBuilder('order_product');
      query = query
        .leftJoinAndSelect('order_product.order', 'order')
        .leftJoinAndSelect('order_product.product', 'product');
      const orderProduct = await query.skip(offset).take(limit).getMany();

      await this.redis.set(
        redisKey,
        JSON.stringify(orderProduct),
        'EX',
        60 * 60,
      );

      return orderProduct;
    }
  }

  async findOne(id: number) {
    const orderProduct = await this.orderProductRepository.findOne({
      where: { id },
      relations: ['Order', 'product'],
    });
    if (!orderProduct) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return orderProduct;
  }

  async update(id: number, updateOrderProductDto: UpdateOrderProductDto) {
    const orderProduct = await this.orderProductRepository.findOne({
      where: { id },
    });
    if (!orderProduct) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const newOrderProductData = Object.assign(
      orderProduct,
      updateOrderProductDto,
    );
    await this.orderProductRepository.save(newOrderProductData);
    return { status: HttpStatus.OK, message: 'Order Product is Updated' };
  }

  async remove(id: number) {
    const orderProduct = await this.orderProductRepository.findOne({
      where: { id },
    });
    if (!orderProduct) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.orderProductRepository.remove(orderProduct);
    return { status: HttpStatus.OK, message: 'Order Product is Deleted' };
  }
}
