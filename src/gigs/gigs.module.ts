import { Module } from '@nestjs/common';
import { GigsService } from './gigs.service';
import { GigsController } from './gigs.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigModule } from '../multer-config/multer-config.module';
import { MulterConfigService } from '../multer-config/multer-config.service';
import { ReviewsService } from 'src/reviews/reviews.service';
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
  providers: [GigsService, ReviewsService, S3ServerService],
  controllers: [GigsController],
})
export class GigsModule {}
