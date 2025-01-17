import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { User } from 'src/auth/entities/auth.entity';
import { Repository } from 'typeorm';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRedis() private readonly redis: Redis,
  ) {}
  async create(createOrderDto: CreateOrderDto, id: number) {

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const order = this.orderRepository.create({
      ...createOrderDto,
      user,
    });
    const result = await this.orderRepository.save(order);
    await this.redis.set(String(result.id), JSON.stringify(result));
    return { status: HttpStatus.CREATED, message: 'Created' };
  }

  async findAll(page: number, limit: number, search: string) {
    const offset = (page - 1) * limit;
    let redisKey = `order_${page}_${limit}_${search}`;

    const redisData = await this.redis.get(redisKey);
    if (redisData) {
      return JSON.parse(redisData);
    } else {
      let query = this.orderRepository.createQueryBuilder('orders');

      if (search) {
        query = query
        .where('orders.status LIKE :search', { search: `%${search}%` })
        .orWhere('orders.total_price::text LIKE :search');
      }
      query = query
      .leftJoinAndSelect('orders.user', 'user')
      .leftJoinAndSelect('orders.orderProducts', 'orderProducts') 
      const order = await query.skip(offset).take(limit).getMany();

      await this.redis.set(redisKey, JSON.stringify(order), 'EX', 60 * 60);

      return order;
    }
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!order) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const newOrderData = Object.assign(order, updateOrderDto);
    await this.orderRepository.save(newOrderData);
    return { status: HttpStatus.OK, message: 'Order is Updated' };
  }

  async remove(id: number) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.orderRepository.remove(order);
    return { status: HttpStatus.OK, message: 'Order is Deleted' };
  }
}
