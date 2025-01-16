import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomJwtModule } from './custom-jwt/custom-jwt.module';
import { GuardModule } from './guard/guard.module';
import { UserModule } from './user/user.module';
import { AuthGuard } from './guard/auth.guard';
import { RolesGuard } from './guard/role.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { OrderProductModule } from './order-product/order-product.module';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6390',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PG_HOST') || 'super-db',
        port: configService.get<number>('PG_PORT') || 5432,
        username: configService.get('PG_USER') || 'postgres',
        password: configService.get('PG_PASSWORD') || 'saman77071!',
        database: configService.get('PG_DATABASE') || 'besicp',
        entities: [__dirname + '/**/*.entity.{js,ts}'],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<number>('SMTP_PORT'),
          secure: false,
          auth: {
            user: configService.get<string>('USER_MAIL'),
            pass: configService.get<string>('USER_MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: configService.get<string>('SMTP_USER'),
        },
      }),
    }),
    JwtModule.register({}),
    AuthModule,
    EmailModule,
    CustomJwtModule,
    GuardModule,
    UserModule,
    OrderModule,
    ProductModule,
    OrderProductModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
