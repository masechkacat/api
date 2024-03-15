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
}
