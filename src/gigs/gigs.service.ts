import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateGigDto } from './dto/create-gig.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EditGigDto } from './dto/edit-gig.dto';

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
      include: { createdBy: true },
    });

    if (gig.createdBy) {
      delete gig.createdBy.password; // remove password from response
    }

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
}
