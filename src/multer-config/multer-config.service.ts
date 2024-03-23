import { Injectable } from '@nestjs/common';
import * as multer from 'multer';

@Injectable()
export class MulterConfigService {
  getMulterConfig(
    fileFilterFunction?: (
      req: Request,
      file: Express.Multer.File,
      cb: multer.FileFilterCallback,
    ) => void,
  ) {
    return {
      storage: multer.memoryStorage(),
      fileFilter: fileFilterFunction
        ? fileFilterFunction
        : (req, file, cb) => {
            if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
              cb(null, true);
            } else {
              cb(new Error('Unsupported file type'), false);
            }
          },
    };
  }
}
