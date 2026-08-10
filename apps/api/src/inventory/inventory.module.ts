import { Module } from "@nestjs/common";

import { EventEmitterModule }
from "@nestjs/event-emitter";

import { InventoryService }
from "./inventory.service";

import { InventoryController }
from "./inventory.controller";

import { FinanceModule } from "../finance/finance.module";
import { AuditModule }
from "../audit/audit.module";

import { RealtimeModule }
from "../realtime/realtime.module";

import { NotificationsModule }
from "../notifications/notifications.module";

import { PrismaModule }
from "../prisma/prisma.module";

@Module({

  imports: [

    PrismaModule,

    AuditModule,
    FinanceModule,
    RealtimeModule,

    NotificationsModule,

    EventEmitterModule.forRoot(),


  ],

  providers: [

    InventoryService,
  ],

  controllers: [

    InventoryController,
  ],
})

export class InventoryModule {}