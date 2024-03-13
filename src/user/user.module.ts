import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigModule } from 'src/multer-config/multer-config.module';
import { MulterConfigService } from 'src/multer-config/multer-config.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [MulterConfigModule],
      inject: [MulterConfigService],
      useFactory: async (multerConfigService: MulterConfigService) => {
        return multerConfigService.getMulterConfig('profiles');
      },
    }),
    // other imports...
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
