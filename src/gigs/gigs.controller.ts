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
  Get,
  Delete,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GigsService } from './gigs.service';
import { GetUser } from '../auth/decorator';
import { CreateGigDto } from './dto/create-gig.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ValidationExceptionFilter } from './exception-filter/validation-exception.filter';
import { EditGigDto } from './dto/edit-gig.dto';
import { ReviewsService } from '../reviews/reviews.service';

@ApiTags('gigs')
@Controller('gigs')
export class GigsController {
  constructor(
    private readonly gigsService: GigsService,
    private readonly reviewsService: ReviewsService,
  ) {}

  @Post('create')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @UseInterceptors(FilesInterceptor('images', 4))
  @UseFilters(new ValidationExceptionFilter())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create gig' })
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
  @ApiOperation({ summary: 'Edit gig' })
  async editGig(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) gigId: number,
    @Body() editGigDto: EditGigDto,
  ) {
    return this.gigsService.editGig(userId, gigId, editGigDto);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get gig by id' })
  async getGigById(@Param('id', ParseIntPipe) gigId: number) {
    const gig = await this.gigsService.getGigById(gigId);
    const averageRating =
      await this.reviewsService.calculateAverageRating(gigId);
    const totalReviewsCount =
      await this.reviewsService.totalReviewsCount(gigId);
    return { ...gig, averageRating, totalReviewsCount };
  }

  @Get()
  @ApiOperation({ summary: 'Get all gigs' })
  async getAllGigs() {
    return this.gigsService.getAllGigs();
  }

  @Get('user/:id?')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get all gigs by user id or current user if id is not provided',
  })
  async getAllGigsByUserId(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: number,
  ) {
    const targetId = id ?? userId;
    return this.gigsService.getAllGigsByUserId(targetId);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete gig' })
  async deleteGig(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) gigId: number,
  ) {
    return this.gigsService.deleteGig(userId, gigId);
  }
}
