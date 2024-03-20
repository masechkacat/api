// dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSellerData(userId: number) {
    try {
      const gigsCount = await this.prisma.gigs.count({
        where: { userId: userId },
      });
      console.log('Gigs count:', gigsCount);

      const ordersCount = await this.prisma.orders.count({
        where: {
          gig: {
            userId: userId,
          },
          isCompleted: true,
        },
      });
      console.log('Orders count:', ordersCount);

      const unreadMessagesCount = await this.prisma.message.count({
        where: {
          recipientId: userId,
          isRead: false,
        },
      });
      console.log('Unread messages count:', unreadMessagesCount);

      const today = new Date();
      const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const thisYearStart = new Date(today.getFullYear(), 0, 1);

      const [dailyRevenue, monthlyRevenue, annualRevenue] = await Promise.all([
        this.calculateRevenue(userId, new Date(today.setHours(0, 0, 0, 0))),
        this.calculateRevenue(userId, thisMonthStart),
        this.calculateRevenue(userId, thisYearStart),
      ]);
      console.log('Revenue:', dailyRevenue, monthlyRevenue, annualRevenue);

      return {
        gigsCount,
        ordersCount,
        unreadMessagesCount,
        dailyRevenue,
        monthlyRevenue,
        annualRevenue,
      };
    } catch (error) {
      console.error('Error getting seller data:', error);
      throw new Error('Error getting seller data');
    }
  }

  private async calculateRevenue(userId: number, startDate: Date) {
    const { _sum } = await this.prisma.orders.aggregate({
      _sum: {
        price: true,
      },
      where: {
        gig: {
          userId: userId,
        },
        isCompleted: true,
        createdAt: {
          gte: startDate,
        },
      },
    });

    return _sum.price || 0;
  }
}
