import { Module } from "@nestjs/common";

import { AnalyticsController } from "./analytics.controller";
import { AnalyticsService } from "./analytics.service";


import { AIModule }
from "../ai/ai.module";

import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule, AIModule,],

  controllers: [AnalyticsController],

  providers: [AnalyticsService],
})
export class AnalyticsModule {}