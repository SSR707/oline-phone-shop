import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderProductDto {
  @ApiProperty({
    type: Number,
    description: 'Order id',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @ApiProperty({
    type: Number,
    description: 'Product id',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  productId: number;
}
