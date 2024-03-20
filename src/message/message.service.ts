import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { OrdersService } from '../orders/orders.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(
    private prisma: PrismaService,
    private ordersService: OrdersService,
  ) {}

  async addMessage(
    senderId: number,
    recipientId: number,
    createMessageDto: CreateMessageDto,
  ) {
    const { orderId, text } = createMessageDto;
    try {
      return await this.prisma.message.create({
        data: {
          sender: { connect: { id: senderId } },
          recipient: { connect: { id: recipientId } },
          order: { connect: { id: orderId } },
          text,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException(
            'One of the IDs (sender, recipient, or order) does not exist.',
          );
        }
      }
      throw new InternalServerErrorException('An unexpected error occurred.');
    }
  }

  async getMessages(orderId: number, userId: number) {
    const order = await this.ordersService.getOrderWithGig(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }

    const isRelated = await this.ordersService.isUserRelatedToOrder(
      orderId,
      userId,
    );
    if (!isRelated) {
      throw new UnauthorizedException('You do not have access to this order.');
    }
    const messages = await this.prisma.message.findMany({
      where: { order: { id: orderId } },
      orderBy: { createdAt: 'asc' },
    });

    await this.prisma.message.updateMany({
      where: { orderId, recipientId: userId },
      data: { isRead: true },
    });

    const recipientId: number =
      order.buyerId === userId ? order.gig.userId : order.buyerId;

    return { messages, recipientId };
  }

  async getUnreadMessages(userId: number) {
    const messages = await this.prisma.message.findMany({
      where: { recipientId: userId, isRead: false },
      include: { sender: true },
    });
    if (messages.length === 0) {
      throw new NotFoundException('No unread messages found.');
    }
    return messages;
  }

  async markAsRead(messageId: number) {
    const updateResponse = await this.prisma.message.updateMany({
      where: { id: messageId, isRead: false },
      data: { isRead: true },
    });
    if (updateResponse.count === 0) {
      throw new NotFoundException(
        `Message with ID ${messageId} not found or already read.`,
      );
    }
  }
}
