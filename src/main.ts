import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
