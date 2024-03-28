// orders.controller.ts
import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { CreateOrderDto } from './dto/create-oder.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';

@ApiTags('orders')
@ApiBearerAuth('access-token')
@Controller('orders')
@UseGuards(JwtGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create order' })
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser('id') userId: number,
  ) {
    return this.ordersService.createOrder(createOrderDto.gigId, userId);
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Confirm order' })
  async confirmOrder(@Body('paymentIntent') paymentIntent: string) {
    return this.ordersService.confirmOrder(paymentIntent);
  }

  @Get('buyer')
  @ApiOperation({ summary: 'Get buyer orders' })
  async getBuyerOrders(@GetUser() userId: number) {
    return this.ordersService.getBuyerOrders(userId);
  }

  @Get('seller')
  @ApiOperation({ summary: 'Get seller orders' })
  async getSellerOrders(@GetUser() userId: number) {
    return this.ordersService.getSellerOrders(userId);
  }
}
