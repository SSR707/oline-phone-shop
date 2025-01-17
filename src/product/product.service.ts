import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Product_enum } from 'src/common/enums/enums';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRedis() private readonly redis: Redis,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const result = await this.productRepository.save(createProductDto);
    await this.redis.set(String(result.id), JSON.stringify(result));
    return { status: HttpStatus.CREATED, message: 'Created' };
  }

  async findAll(page: number, limit: number, search: string) {
    const offset = (page - 1) * limit;
    let redisKey = `products_${page}_${limit}_${search}`;

    const redisData = await this.redis.get(redisKey);
    if (redisData) {
      return JSON.parse(redisData);
    } else {
      let query = this.productRepository.createQueryBuilder('product');

      if (search) {
        query = query
          .where(
            '(product.name LIKE :search OR product.info LIKE :search OR product.quantity::text LIKE :search OR product.price::text LIKE :search)',
            {
              search: `%${search}%`,
            },
          )
          .andWhere('product.status = :status', { status: 'active' });
      } else {
        query = query.where('product.status = :status', { status: 'active' });
      }
      query = query.leftJoinAndSelect('product.orderProducts', 'orderProducts');
      const products = await query.skip(offset).take(limit).getMany();

      await this.redis.set(redisKey, JSON.stringify(products), 'EX', 60 * 60);

      return products;
    }
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id, status: Product_enum.ACTIVE },
      relations: ['orderProducts'],
    });
    if (!product) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: { id, status: Product_enum.ACTIVE },
    });
    if (!product) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const newProductData = Object.assign(product, updateProductDto);
    await this.productRepository.save(newProductData);
    return { status: HttpStatus.OK, message: 'Product is Updated' };
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({
      where: { id, status: Product_enum.ACTIVE },
    });
    if (!product) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.productRepository.remove(product);
    return { status: HttpStatus.OK, message: 'Product is Deleted' };
  }
}
