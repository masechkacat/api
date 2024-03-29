import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateGigDto } from './dto/create-gig.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EditGigDto } from './dto/edit-gig.dto';
import { SearchGigsDto } from './dto/search-gigs.dto';
import { S3ServerService } from '../s3-server/s3-server.service';
import { ReviewsService } from '../reviews/reviews.service';

@Injectable()
export class GigsService {
  constructor(
    private prisma: PrismaService,
    private s3ServerService: S3ServerService,
    private reviewsService: ReviewsService,
  ) {}

  removePasswordFromUser(user: any) {
    if (user) {
      delete user.password;
    }
  }

  removePasswords(gigs: any[]) {
    gigs.forEach(gig => {
      this.removePasswordFromUser(gig.createdBy);
      gig.reviews.forEach(review => {
        this.removePasswordFromUser(review.reviewer);
      });
    });
    return gigs;
  }


  async createGig(
    userId: number,
    createGigDto: CreateGigDto,
    fileNames: Array<Express.Multer.File>,
  ) {

    const fileUrls = await this.s3ServerService.uploadFiles(fileNames);

    return this.prisma.gigs.create({
      data: {
        userId,
        ...createGigDto,
        images: fileUrls,
      },
    });
  }

  async editGig(userId: number, gigId: number, editGigDto: EditGigDto) {
    const gig = await this.prisma.gigs.findUnique({ where: { id: gigId } });

    if (!gig || gig.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    return this.prisma.gigs.update({
      where: { id: gigId },
      data: editGigDto,
    });
  }

  async getGigById(gigId: number) {
    let gig = await this.prisma.gigs.findFirst({
      where: { id: gigId },
      include: {
        reviews: {
          include: {
            reviewer: true, // Включаем информацию о рецензенте
          },
        },
        createdBy: true,
      },
    });

    this.removePasswords([gig]); // Так как gig не массив, оборачиваем его в массив

    const ratingData = await this.reviewsService.getRatingData(gigId);
    gig = { ...gig, ...ratingData };

    return gig;
  }

  async getGigs(searchGigsDto?: SearchGigsDto) {
  let gigs: any[];
  if (searchGigsDto) {
    const query = this.createSearchQuery(searchGigsDto);
    gigs = await this.prisma.gigs.findMany(query);
  } else {
    gigs = await this.prisma.gigs.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            profileImage: true,
          },
        },
      },
    });
  }

  gigs = await Promise.all(gigs.map(async gig => {
    const ratingData = await this.reviewsService.getRatingData(gig.id);
    return { ...gig, ...ratingData };
  }));

  return this.removePasswords(gigs);
}

async getAllGigsByUserId(userId: number) {
  let gigs = await this.prisma.gigs.findMany({
    where: { userId: userId },
    include: {
      createdBy: {
        select: {
          id: true,
          fullName: true,
          profileImage: true,
        },
      },
    },
  });

  gigs = await Promise.all(gigs.map(async gig => {
    const ratingData = await this.reviewsService.getRatingData(gig.id);
    return { ...gig, ...ratingData };
  }));

  return gigs;
}

  async deleteGig(userId: number, gigId: number) {
    const gig = await this.prisma.gigs.findUnique({ where: { id: gigId } });

    if (!gig || gig.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    return this.prisma.gigs.delete({ where: { id: gigId } });
  }

  private createSearchQuery({ searchTerm, category }: SearchGigsDto) {
    const query: { where: any; include: any } = {
      where: {},
      include: {
        reviews: {
          include: {
            reviewer: true,
          },
        },
        createdBy: true,
      },
    };

    const orConditions = [];

    if (searchTerm) {
      orConditions.push({
        title: { contains: searchTerm, mode: 'insensitive' },
      });
    }
    if (category) {
      orConditions.push({
        category: { contains: category, mode: 'insensitive' },
      });
    }

    if (orConditions.length) {
      query.where.OR = orConditions;
    }

    return query;
  }
}
