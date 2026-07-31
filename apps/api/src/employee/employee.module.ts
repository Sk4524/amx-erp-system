import { Module } from "@nestjs/common";

import { EmployeeController } from "./employee.controller";
import { EmployeeService } from "./employee.service";
import { PendingEmployeeService } from "./services/pending-employee.service";
import { AuditModule } from "../audit/audit.module";
import { PrismaModule } from "../prisma/prisma.module";
import { EmployeeOnboardingService } from "./services/employee-onboarding.service";
@Module({
  imports: [
    PrismaModule,
    AuditModule,
  ],
  controllers: [
    EmployeeController,
  ],
  providers: [
    EmployeeService,
    EmployeeOnboardingService,
    PendingEmployeeService,
  ],
  exports: [
    EmployeeService,
    EmployeeOnboardingService,
    PendingEmployeeService,
  ],
})
export class EmployeeModule {}