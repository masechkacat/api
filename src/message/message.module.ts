import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { OrdersService } from 'src/orders/orders.service';

@Module({
  providers: [MessageService, OrdersService],
  controllers: [MessageController],
})
export class MessageModule {}
