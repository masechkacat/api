import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
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
    await this.prisma.user.update({
      where: { id: userId },
      data: { profileImage: file.filename },
    });

    const host = this.config.get('HOST');
    const port = this.config.get('PORT');
    return { filePath: `${host}:${port}/uploads/profiles/${file.filename}` };
  }
}
