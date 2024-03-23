// gigs.controller.ts
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  Param,
  ParseIntPipe,
  Patch,
  Get,
  Delete,
  Query,
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
import { EditGigDto } from './dto/edit-gig.dto';
import { ReviewsService } from '../reviews/reviews.service';
import { SearchGigsDto } from './dto/search-gigs.dto';

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
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create gig' })
  async createGig(
    @GetUser('id') userId: number,
    @Body() createGigDto: CreateGigDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    return this.gigsService.createGig(userId, createGigDto, images);
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
    return this.gigsService.getGigById(gigId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all gigs or search gigs' })
  async getGigs(@Query() searchGigsDto?: SearchGigsDto) {
    return this.gigsService.getGigs(searchGigsDto);
  }

  @Get('user/me')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all gigs by current user' })
  async getAllGigsByCurrentUser(@GetUser('id') userId: number) {
    console.log(userId);
    return this.gigsService.getAllGigsByUserId(userId);
  }

  @Get('user/:id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get all gigs by user id',
  })
  async getAllGigsByUserId(@Param('id', ParseIntPipe) id: number) {
    return this.gigsService.getAllGigsByUserId(id);
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
