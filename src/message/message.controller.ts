import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';

@UseGuards(JwtGuard)
@ApiTags('messages')
@ApiBearerAuth('access-token')
@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @ApiOperation({ summary: 'Send a message to a user' })
  @ApiParam({ name: 'recipientId', type: 'number' })
  @Post(':recipientId')
  async addMessage(
    @GetUser('id') senderId: number,
    @Param('recipientId', ParseIntPipe) recipientId: number,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.messageService.addMessage(
      senderId,
      recipientId,
      createMessageDto,
    );
  }
  @ApiOperation({ summary: 'Get messages for an order' })
  @ApiParam({ name: 'orderId', type: 'number' })
  @Get('orders/:orderId')
  async getMessages(
    @GetUser('id') userId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    return this.messageService.getMessages(orderId, userId);
  }

  @ApiOperation({ summary: 'Get unread messages for a user, optionally filtered by order' })
  @ApiQuery({ name: 'orderId', required: false })
  @Get('unread')
  async getUnreadMessages(
    @GetUser('id') userId: number,
    @Query('orderId') orderId?: string,
  ) {
    return this.messageService.getUnreadMessages(userId, orderId ? Number(orderId) : undefined);
  }
  

  @ApiOperation({ summary: 'Mark a message as read' })
  @ApiParam({ name: 'messageId', type: 'number' })
  @Put('read/:messageId')
  async markAsRead(@Param('messageId', ParseIntPipe) messageId: number) {
    return this.messageService.markAsRead(messageId);
  }
}
