// gigs.controller.ts
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GigsService } from './gigs.service';
import { GetUser } from '../auth/decorator';
import { CreateGigDto } from './dto/create-gig.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ValidationExceptionFilter } from './exception-filter/validation-exception.filter';

@ApiTags('gigs')
@Controller('gigs')
export class GigsController {
  constructor(private readonly gigsService: GigsService) {}

  @Post('create')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @UseInterceptors(FilesInterceptor('images'))
  @UseFilters(new ValidationExceptionFilter())
  @ApiConsumes('multipart/form-data')
  async createGig(
    @GetUser('id') userId: number,
    @Body() createGigDto: CreateGigDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    const fileNames = images.map((file) => file.filename);
    return this.gigsService.createGig(userId, createGigDto, fileNames);
  }
}
