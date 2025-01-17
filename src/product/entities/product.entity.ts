import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product_enum } from 'src/common/enums/enums';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: String,
    description: 'Product Name',
    example: 'Apple',
  })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({
    type: Number,
    description: 'Product Price',
    example: 1000,
  })
  @Column({ type: 'decimal' })
  price: number;

  @ApiProperty({
    type: String,
    description: 'Product info',
    example: 'new',
  })
  @Column({ length: 500 })
  info: string;

  @ApiProperty({
    type: Number,
    description: 'Product Quantity',
    example: 100,
  })
  @Column()
  quantity: number;

  @ApiProperty({
    type: String,
    description: 'Product Status',
    example: Product_enum.ACTIVE,
  })
  @Column({ enum: Product_enum, default: Product_enum.ACTIVE })
  status:string

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
  orderProducts: OrderProduct[];
}
