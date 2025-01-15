import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { VerifyUserDto } from './dto/verifyUser-auth.dto';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from 'src/decorator/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: "Yangi foydalanuvchini ro'yxatdan o'tkazish" })
  @ApiConflictResponse({ description: 'User with this email already exists' })
  @ApiOkResponse({ description: 'Created' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Foydalanuvchini hisobiga kirish' })
  @ApiNotFoundResponse({ description: 'User NOT_FOUND' })
  @ApiUnauthorizedResponse({ description: 'User Is Not Actived' })
  @ApiUnauthorizedResponse({
    description: 'You have entered an invalid username or password',
  })
  @ApiOkResponse({ description: 'Token' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('verifyUser')
  @ApiOperation({ summary: 'Foydalanuvchini ozini shaxsini tastiklash' })
  @ApiNotFoundResponse({ description: 'User NOT_FOUND' })
  @ApiUnauthorizedResponse({ description: 'invalid otp' })
  verifyUser(@Body() verifyUserDto: VerifyUserDto) {
    return this.authService.verifyUser(verifyUserDto);
  }
}
