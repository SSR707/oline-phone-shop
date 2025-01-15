import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class RegisterDto {
  @ApiProperty({
    type: String,
    description: 'User fullname',
    example: 'Jhon Doe',
  })
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({
    type: Number,
    description: 'User Age',
    example: 20,
  })
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @ApiProperty({
    type: String,
    description: 'User Phone',
    example: '+99877777707',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    type: String,
    description: 'User Email',
    example: 'jhondoe@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description: 'User Password',
    example: 'qwert123',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    description: 'User Role',
    example: 'USER',
    enum: Role,
    default: Role.USER,
  })
  role: string;
}
