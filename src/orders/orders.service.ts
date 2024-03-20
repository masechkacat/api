// orders.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class OrdersService {
  stripe: Stripe;
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    const stripeApiKey = this.config.get('STRIPE_API_KEY');
    this.stripe = new Stripe(stripeApiKey, {
      apiVersion: '2023-10-16',
    });
  }

  async createOrder(gigId: number, userId: number) {
    const gig = await this.prisma.gigs.findUnique({
      where: { id: gigId },
    });
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: gig?.price * 100,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });
    await this.prisma.orders.create({
      data: {
        paymentIntent: paymentIntent.id,
        price: gig?.price,
        buyer: { connect: { id: userId } },
        gig: { connect: { id: gig?.id } },
      },
    });
    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  async confirmOrder(paymentIntent: string) {
    await this.prisma.orders.update({
      where: { paymentIntent: paymentIntent },
      data: { isCompleted: true },
    });
  }

  async getBuyerOrders(userId: number) {
    return this.prisma.orders.findMany({
      where: { buyerId: userId, isCompleted: true },
      include: { gig: true },
    });
  }

  async getSellerOrders(userId: number) {
    return this.prisma.orders.findMany({
      where: {
        gig: {
          createdBy: {
            id: userId,
          },
        },
        isCompleted: true,
      },
      include: {
        gig: true,
        buyer: true,
      },
    });
  }
}
