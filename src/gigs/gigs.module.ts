import { Module } from '@nestjs/common';
import { GigsService } from './gigs.service';
import { GigsController } from './gigs.controller';

@Module({
  providers: [GigsService],
  controllers: [GigsController]
})
export class GigsModule {}
