import { Injectable } from '@nestjs/common';
import { CreateGigDto } from './dto/create-gig.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
