import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(
    createReviewDto: CreateReviewDto,
    userId: number,
    gigId: number,
  ) {
    const review = await this.prisma.reviews.create({
      data: {
        rating: createReviewDto.rating,
        reviewText: createReviewDto.reviewText,
        reviewer: { connect: { id: userId } },
        gig: { connect: { id: gigId } },
      },
      include: {
        reviewer: true,
      },
    });

    if (review.reviewer) {
      delete review.reviewer.password;
    }

    return review;
  }

  async getRatingData(gigId: number): Promise<{averageRating: number, totalReviewsCount: number}> {
    const result = await this.prisma.reviews.aggregate({
      where: { gigId },
      _avg: {
        rating: true,
      },
      _count: true,
    });
  
    const averageRating = parseFloat((result._avg.rating || 0).toFixed(1));
    const totalReviewsCount = result._count;
  
    return { averageRating, totalReviewsCount };
  }
}
