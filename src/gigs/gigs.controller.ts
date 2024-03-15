// gigs.controller.ts
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  UseFilters,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GigsService } from './gigs.service';
import { GetUser } from '../auth/decorator';
import { CreateGigDto } from './dto/create-gig.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ValidationExceptionFilter } from './exception-filter/validation-exception.filter';
import { EditGigDto } from './dto/edit-gig.dto';

@ApiTags('gigs')
@Controller('gigs')
export class GigsController {
  constructor(private readonly gigsService: GigsService) {}

  @Post('create')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @UseInterceptors(FilesInterceptor('images', 4))
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

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  async editGig(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) gigId: number,
    @Body() editGigDto: EditGigDto,
  ) {
    return this.gigsService.editGig(userId, gigId, editGigDto);
  }
}
