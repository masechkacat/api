import { Module } from '@nestjs/common';
import { S3ServerService } from './s3-server.service';

@Module({
  providers: [S3ServerService],
  exports: [S3ServerService],
})
export class S3ServerModule {}
