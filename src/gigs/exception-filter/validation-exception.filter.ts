// validation-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';

@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    // Проверяем, является ли исключение ошибкой валидации (например, статус 400)
    if (status === 400 && request.files) {
      // Удаление всех загруженных файлов, если они есть
      const files: Array<Express.Multer.File> =
        request.files as Array<Express.Multer.File>;
      files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error(`Error deleting file ${file.filename}:`, err);
          } else {
            console.log(`Deleted file ${file.filename}`);
          }
        });
      });
    }

    // Отправляем ответ об ошибке валидации клиенту
    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.getResponse(),
    });
  }
}
