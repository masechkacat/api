import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    if (!gig) {
      throw new NotFoundException(`Gig with ID "${gigId}" not found`);
    }

    let paymentIntent: Stripe.Response<Stripe.PaymentIntent>;
    try {
      paymentIntent = await this.stripe.paymentIntents.create({
        amount: gig?.price * 100,
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create payment intent');
    }

    try {
      await this.prisma.orders.create({
        data: {
          paymentIntent: paymentIntent.id,
          price: gig?.price,
          buyer: { connect: { id: userId } },
          gig: { connect: { id: gig?.id } },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create order');
    }

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  async confirmOrder(paymentIntent: string) {
    try {
      await this.prisma.orders.update({
        where: { paymentIntent: paymentIntent },
        data: { isCompleted: true },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to confirm order');
    }
  }

  async getBuyerOrders(userId: number) {
    try {
      return this.prisma.orders.findMany({
        where: { buyerId: userId, isCompleted: true },
        include: { gig: true },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to get buyer orders');
    }
  }

  async getSellerOrders(userId: number) {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException('Failed to get seller orders');
    }
  }
}
