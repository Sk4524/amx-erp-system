import { Module }
from "@nestjs/common";

import { SalesController }
from "./sales.controller";

import { SalesService }
from "./sales.service";

import { PrismaModule }
from "../prisma/prisma.module";

import { RedisModule }
from "../redis/redis.module";

import { RealtimeModule }
from "../realtime/realtime.module";
import { AuditModule }
from "../audit/audit.module";

@Module({

  imports: [

    PrismaModule,

    RedisModule,

    RealtimeModule,
    AuditModule
  ],

  controllers: [

    SalesController
  ],

  providers: [

    SalesService
  ],
})

export class SalesModule {}