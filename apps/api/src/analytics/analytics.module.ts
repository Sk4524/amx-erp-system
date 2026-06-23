import { Module } from "@nestjs/common";

import { AnalyticsController } from "./analytics.controller";
import { AnalyticsService } from "./analytics.service";

import { AIInsightsService }
from "./ai-insights.service";

import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],

  controllers: [AnalyticsController],

  providers: [AnalyticsService,AIInsightsService],
})
export class AnalyticsModule {}