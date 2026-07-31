import { Module } from "@nestjs/common";

import { PayrollController } from "./payroll.controller";
import { PayrollService } from "./payroll.service";

import { PrismaModule } from "../prisma/prisma.module";
import { AuditModule } from "../audit/audit.module";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    NotificationsModule,
  ],

  controllers: [
    PayrollController,
  ],

  providers: [
    PayrollService,
  ],

  exports: [
    PayrollService,
  ],
})
export class PayrollModule {}