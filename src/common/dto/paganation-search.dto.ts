import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PegenationAndSearch {
  @ApiProperty({
    type: Number,
    description: 'Page',
    example: 1,
  })
  @IsNotEmpty()
  page: number;

  @ApiProperty({
    type: Number,
    description: 'limit',
    example: 10,
  })
  @IsNotEmpty()
  limit: number;

  @ApiProperty({
    type: String,
    description: 'Sarech',
    example: 'hello',
  })
  @IsNotEmpty()
  search: string;
}
