import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNumber, IsString } from 'class-validator';
import { Status } from 'src/common/enums/enums';

export class CreateOrderDto {
  @ApiProperty({
    type: Number,
    description: 'Order Price',
    example: 20,
  })
  @IsDecimal()
  price: number;

  @ApiProperty({
    type: String,
    description: 'Order Status',
    example: Status,
  })
  @IsString()
  status: string;
}
