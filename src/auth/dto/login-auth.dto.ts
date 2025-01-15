import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    type: String,
    description: 'User Email',
    example: 'jhondoe@gmail.com',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description: 'User Password',
    example: 'qwert123',
  })
  @IsNotEmpty()
  password: string;
}
