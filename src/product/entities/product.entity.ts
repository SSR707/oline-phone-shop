import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
  orderProducts: OrderProduct[];
}
