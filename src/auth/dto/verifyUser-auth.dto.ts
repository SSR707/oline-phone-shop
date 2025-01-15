import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerifyUserDto {
  @ApiProperty({
    type: String,
    description: 'User Email',
    example: 'jhondoe@gmail.com',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: Number,
    description: 'Otp Code',
    example: '0000',
  })
  @IsNotEmpty()
  otp_code: number;
}
