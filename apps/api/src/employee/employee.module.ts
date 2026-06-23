import { Module } from "@nestjs/common";

import { EmployeeService }
from "./employee.service";

import { EmployeeController }
from "./employee.controller";

import { AuditModule }
from "../audit/audit.module";

@Module({

  imports: [
    AuditModule,
  ],

  providers: [
    EmployeeService,
  ],

  controllers: [
    EmployeeController,
  ],
})
export class EmployeeModule {}