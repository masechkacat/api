// dashboard.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtGuard)
@ApiBearerAuth('access-token')
@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get seller data' })
  async getSellerData(@GetUser('id') userId: number) {
    console.log('userId', userId);
    return this.dashboardService.getSellerData(userId);
  }
}
