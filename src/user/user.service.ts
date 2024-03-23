import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { S3ServerService } from '../s3-server/s3-server.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3ServerService,
  ) {}

  async getUserById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    delete user.password;
    return user;
  }

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete user.password;

    return user;
  }

  async setUserImage(userId: number, file: Express.Multer.File) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (user.profileImage) {
      await this.s3Service.deleteFile(user.profileImage);
    }

    const filePath = await this.s3Service.uploadFile(file);

    await this.prisma.user.update({
      where: { id: userId },
      data: { profileImage: filePath },
    });

    return { filePath };
  }
}
