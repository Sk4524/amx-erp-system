import { Module } from "@nestjs/common";

import { ForecastingController }
from "./forecasting.controller";

import { ForecastingService }
from "./forecasting.service";

import { PrismaModule }
from "../prisma/prisma.module";
import { AuditService }
from "../audit/audit.service";

import { RedisModule }
from "../redis/redis.module";

@Module({

  imports: [
    PrismaModule,
    RedisModule,

  ],

  controllers: [
    ForecastingController,
  ],

  providers: [
    ForecastingService,
    AuditService,
  ],
})
export class ForecastingModule {}