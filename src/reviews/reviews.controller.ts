import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtGuard)
@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':gigId')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Add review' })
  async addReview(
    @Param('gigId') gigId: number,
    @Body() createReviewDto: CreateReviewDto,
    @GetUser('id') userId: number,
  ) {
    return this.reviewsService.createReview(createReviewDto, userId, gigId);
  }
}
