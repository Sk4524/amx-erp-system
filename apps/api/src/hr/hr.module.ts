import { Module }
from "@nestjs/common";
import { AuditModule }
from "../audit/audit.module";
import { NotificationsModule }
from "../notifications/notifications.module";
import { HrController }
from "./hr.controller";

import { HrService }
from "./hr.service";

import { PrismaModule }
from "../prisma/prisma.module";

@Module({
  imports: [
    AuditModule,
    NotificationsModule,
    PrismaModule,
  ],

  controllers: [
    HrController,
  ],

  providers: [
    HrService,
  ],
})
export class HrModule {}