import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigModule } from '../multer-config/multer-config.module';
import { MulterConfigService } from '../multer-config/multer-config.service';
import { S3ServerService } from 'src/s3-server/s3-server.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [MulterConfigModule],
      inject: [MulterConfigService],
      useFactory: async (multerConfigService: MulterConfigService) => {
        return multerConfigService.getMulterConfig();
      },
    }),
    // other imports...
  ],
  providers: [UserService, S3ServerService],
  controllers: [UserController],
})
export class UserModule {}
