import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3000;

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

  app.enableCors({
    origin: function (origin, callback) {
      callback(null, true)
    },//a change to the origin of the request
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      // Create an instance of ValidationPipe
      whitelist: true, // Remove any properties that do not have decorators
      //forbidNonWhitelisted: true, // Throw an error if properties are not whitelisted
      transform: true, // Automatically transform payloads to DTO objects
    }),
  );
  app.use('/uploads', express.static('uploads'));
  await app.listen(port, '0.0.0.0', () => {
    console.log(`Application is running on: http://0.0.0.0:${port}`);
  });
}
bootstrap();
