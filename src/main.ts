import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LogtailLogger } from './common/logger/logtail';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
        logger: new LogtailLogger(),
  });
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Phone Project')
    
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .setDescription('The Phone Peoject Auth API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
      security: [{ 'access-token': [] }],
    },
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

