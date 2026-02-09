import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security & Middleware
  app.enableCors({
    origin: ['http://localhost:3000'], // adjust for prod
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Swagger Docs
  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('The pragmatist\'s e-commerce backend')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Products')
    .addTag('Cart')
    .addTag('Orders')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3001);
  console.log('Server running on http://localhost:3001');
}
bootstrap();
