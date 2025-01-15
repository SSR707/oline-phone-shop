import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/auth.entity';
import { Otp } from './entities/otp .entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { CustomJwtModule } from 'src/custom-jwt/custom-jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Otp]),
    EmailModule,
    CustomJwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
