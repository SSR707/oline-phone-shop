import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { RegisterDto } from 'src/auth/dto/register-auth.dto';
import { Role } from 'src/common/enums/role.enum';

export class UpdateUserDto extends PartialType(RegisterDto) {
  @ApiProperty({
    type: String,
    description: 'User fullname',
    example: 'Jhon Doe',
  })
  @IsString()
  @IsOptional()
  fullname: string;

  @ApiProperty({
    type: Number,
    description: 'User Age',
    example: 20,
  })
  @IsNumber()
  @IsOptional()
  age: number;

  @ApiProperty({
    type: String,
    description: 'User Email',
    example: 'jhondoe@gmail.com',
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    type: String,
    description: 'User Password',
    example: 'qwert123',
  })
  @IsStrongPassword()
  @IsOptional()
  password: string;

  @ApiProperty({
    type: String,
    description: 'User Role',
    example: 'USER',
    enum: Role,
    default: Role.USER,
  })
  @IsOptional()
  role: string;
}
