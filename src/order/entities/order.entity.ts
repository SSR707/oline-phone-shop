import { Status } from 'src/common/enums/enums';
import { User } from 'src/auth/entities/auth.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({
    type: Number,
    description: 'Order price',
    example: '500$',
  })
  @Column({ type: 'decimal' })
  total_price: number;

  @ApiProperty({
    type: String,
    description: 'Order status',
    example: Status,
  })
  @Column({ enum: Status, default: Status.PENDING })
  status: string;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  orderProducts: OrderProduct[];
}
