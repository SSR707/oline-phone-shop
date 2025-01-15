import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { VerifyUserDto } from './dto/verifyUser-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { EmailService } from 'src/email/email.service';
import { Otp } from './entities/otp .entity';
import { CustomJwtService } from 'src/custom-jwt/custom-jwt.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Otp) private otpRepository: Repository<Otp>,
    private readonly emailService: EmailService,
    private readonly customJwtService: CustomJwtService,
  ) {}
  async register(registerhDto: RegisterDto) {
    const currentUser = await this.userRepository.findOne({
      where: { email: registerhDto.email },
    });
    if (currentUser) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.CONFLICT,
      );
    }
    const salt = await bcrypt.genSalt();
    registerhDto.password = await bcrypt.hash(registerhDto.password, salt);
    const otp = Math.floor(Math.random() * 100000) + 1;
    await this.emailService.sendActivedOtp(registerhDto.email, 'otp', otp);
    const user = this.userRepository.create(registerhDto);
    await this.userRepository.save(user);
    const otpEntity = this.otpRepository.create({
      email: registerhDto.email,
      otp: otp,
      expire_at: new Date(Date.now() + 10 * 60 * 1000),
    });
    await this.otpRepository.save(otpEntity);
    return { status: HttpStatus.CREATED, message: 'Created' };
  }

  async login(loginDto: LoginDto) {
    const currentUser = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!currentUser) {
      throw new HttpException('User NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    if (currentUser.is_active === false) {
      throw new HttpException('User Is Not Actived', HttpStatus.UNAUTHORIZED);
    }
    const isEqual = await bcrypt.compare(
      loginDto.password,
      currentUser.password,
    );
    if (!isEqual) {
      throw new HttpException(
        'You have entered an invalid username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const accessToken =
      await this.customJwtService.generateAccessToken(currentUser);
    const refreshToken =
      await this.customJwtService.generateRefreshToken(currentUser);
    return { refreshToken, accessToken };
  }

  async verifyUser(verifyUserDto: VerifyUserDto) {
    const currentUser = await this.userRepository.findOne({
      where: { email: verifyUserDto.email },
    });
    if (!currentUser) {
      throw new HttpException('User NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    const currentOtp = await this.otpRepository.findOne({
      where: { email: verifyUserDto.email },
    });
    if (!currentOtp) {
      throw new HttpException('invalid otp', HttpStatus.UNAUTHORIZED);
    }
    if (new Date() > currentOtp.expire_at) {
      throw new HttpException('invalid otp', HttpStatus.UNAUTHORIZED);
    }
    if (currentOtp.otp !== +verifyUserDto.otp_code) {
      throw new HttpException('invalid otp', HttpStatus.UNAUTHORIZED);
    }
    await this.otpRepository.remove(currentOtp);
    currentUser.is_active = true;
    await this.userRepository.save(currentUser);
    return { status: HttpStatus.OK, message: 'User is Actived' };
  }
}
