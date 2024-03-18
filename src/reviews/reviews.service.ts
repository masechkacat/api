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

  async calculateAverageRating(gigId: number): Promise<number> {
    const reviews = await this.prisma.reviews.findMany({
      where: { gigId },
    });

    const averageRating =
      reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviews.length || 0;
    return parseFloat(averageRating.toFixed(1));
  }

  async totalReviewsCount(gigId: number): Promise<number> {
    return this.prisma.reviews.count({
      where: { gigId },
    });
  }
}
