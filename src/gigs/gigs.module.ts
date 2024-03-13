import { Module } from '@nestjs/common';
import { GigsService } from './gigs.service';
import { GigsController } from './gigs.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigModule } from 'src/multer-config/multer-config.module';
import { MulterConfigService } from 'src/multer-config/multer-config.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [MulterConfigModule],
      inject: [MulterConfigService],
      useFactory: async (multerConfigService: MulterConfigService) => {
        return multerConfigService.getMulterConfig('gigs');
      },
    }),
    // other imports...
  ],
  providers: [GigsService],
  controllers: [GigsController],
})
export class GigsModule {}
