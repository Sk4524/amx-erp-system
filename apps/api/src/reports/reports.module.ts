import { Module }
from "@nestjs/common";

import { ReportsController }
from "./reports.controller";

import { ReportsService }
from "./reports.service";


import { PrismaModule }
from "../prisma/prisma.module";

import { QueueModule }
from "../queue/queue.module";

import { ReportGeneratorService }
from "./report-generator.service";
import { AuditModule }
from "../audit/audit.module";
import { NotificationsModule }
from "../notifications/notifications.module";

@Module({

  imports: [

    PrismaModule,

    QueueModule,
    AuditModule,
    NotificationsModule,
  ],

  controllers: [
    ReportsController,
  ],

providers: [

  ReportsService,

  ReportGeneratorService,
],

  exports: [

  ReportGeneratorService,
],
})
export class ReportsModule {}