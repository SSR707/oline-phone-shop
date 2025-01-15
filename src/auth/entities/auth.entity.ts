import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enum';
import { Order } from 'src/order/entities/order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: String,
    description: 'User Fullname',
    example: 'John Doe',
  })
  @Column({ length: 500 })
  fullname: string;

  @ApiProperty({
    type: Number,
    description: 'User Age',
    example: 20,
  })
  @Column()
  age: number;

  @ApiProperty({
    type: String,
    description: 'User Phone',
    example: 'example',
  })
  @Column({ length: 500 })
  phone: string;

  @ApiProperty({
    type: String,
    description: 'User Email',
    example: 'jhondoe@gmail.com',
  })
  @Column({ length: 500 })
  email: string;

  @ApiProperty({
    type: String,
    description: 'User Password',
    example: 'qwert123',
  })
  @Column({ length: 500 })
  password: string;

  @ApiProperty({
    type: String,
    description: 'User Role',
    example: 'USER',
    enum: Role,
    default: Role.USER,
  })
  @Column({ enum: Role, default: Role.USER })
  role: string;

  @Column({ default: false })
  is_active: boolean;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
