import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('NestJS API for SpotForDev')
    .setDescription('This is the API for the SpotForDev application')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      // Create an instance of ValidationPipe
      whitelist: true, // Remove any properties that do not have decorators
      //forbidNonWhitelisted: true, // Throw an error if properties are not whitelisted
    }),
  );
  app.use('/uploads', express.static('uploads'));
  await app.listen(3333);
}
bootstrap();
