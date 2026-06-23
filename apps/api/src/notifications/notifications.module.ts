import { Module }
from "@nestjs/common";

import { NotificationsController }
from "./notifications.controller";

import { NotificationsService }
from "./notifications.service";

import { PrismaModule }
from "../prisma/prisma.module";
import { RealtimeModule }
from "../realtime/realtime.module";
import { AuditModule }
from "../audit/audit.module";

@Module({

  imports: [
    PrismaModule,
     RealtimeModule,
    AuditModule,
  ],

  controllers: [
    NotificationsController,
  ],

  providers: [
  NotificationsService,
],

exports: [
  NotificationsService,
],
})
export class NotificationsModule {}