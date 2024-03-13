import { Injectable } from '@nestjs/common';
import { FileFilterCallback, diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class MulterConfigService {
  getMulterConfig(
    dest: string,
    fileFilterFunction?: (
      req: Request,
      file: Express.Multer.File,
      cb: FileFilterCallback,
    ) => void,
  ) {
    return {
      storage: diskStorage({
        destination: `./uploads/${dest}`,
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
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
