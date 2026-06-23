import { Module }
from "@nestjs/common";

import {
  VendorsController
} from "./vendors.controller";

import {
  VendorsService
} from "./vendors.service";

import { PrismaModule }
from "../prisma/prisma.module";

import { AuditModule }
from "../audit/audit.module";
import { NotificationsModule }
from "../notifications/notifications.module";

@Module({

imports: [
  PrismaModule,
  AuditModule,
  NotificationsModule,
],

  controllers: [
    VendorsController,
  ],

  providers: [
    VendorsService,
  ],
})
export class VendorsModule {}