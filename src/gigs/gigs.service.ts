import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateGigDto } from './dto/create-gig.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EditGigDto } from './dto/edit-gig.dto';
import { SearchGigsDto } from './dto/search-gigs.dto';

@Injectable()
export class GigsService {
  constructor(private prisma: PrismaService) {}

  async createGig(
    userId: number,
    createGigDto: CreateGigDto,
    fileNames: string[],
  ) {
    return this.prisma.gigs.create({
      data: {
        userId,
        ...createGigDto,
        images: fileNames,
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
    const gig = await this.prisma.gigs.findFirst({
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

    if (gig.createdBy) {
      delete gig.createdBy.password; // remove password from response
    }

    // Remove password from each reviewer
    gig.reviews.forEach((review) => {
      if (review.reviewer) {
        delete review.reviewer.password;
      }
    });

    return gig;
  }

  async getAllGigs() {
    return this.prisma.gigs.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });
  }

  async getAllGigsByUserId(targetId: number) {
    return this.prisma.gigs.findMany({
      where: { userId: targetId },
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

  async deleteGig(userId: number, gigId: number) {
    const gig = await this.prisma.gigs.findUnique({ where: { id: gigId } });

    if (!gig || gig.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    return this.prisma.gigs.delete({ where: { id: gigId } });
  }

async searchGigs(searchGigsDto: SearchGigsDto) {
  const query = this.createSearchQuery(searchGigsDto);
  return this.prisma.gigs.findMany(query);
}

private createSearchQuery({ searchTerm, category }: SearchGigsDto) {
  const query = {
    where: {
      OR: [],
    },
    include: {
      reviews: {
        include: {
          reviewer: true,
        },
      },
      createdBy: true,
    },
  };
  if (searchTerm) {
    query.where.OR.push({
      title: { contains: searchTerm, mode: "insensitive" },
    });
  }
  if (category) {
    query.where.OR.push({
      category: { contains: category, mode: "insensitive" },
    });
  }
  return query;
}
}