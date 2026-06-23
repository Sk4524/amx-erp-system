import { Module }
from "@nestjs/common";

import { SchedulerService }
from "./scheduler.service";

import { PrismaModule }
from "../prisma/prisma.module";

import { QueueModule }
from "../queue/queue.module";

import { ReportsModule }
from "../reports/reports.module";

@Module({

  imports: [

    PrismaModule,

    QueueModule,

    ReportsModule
  ],

  providers: [
    SchedulerService,
  ],
})
export class SchedulerModule {}