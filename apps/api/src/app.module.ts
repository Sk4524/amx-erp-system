import { Module } from "@nestjs/common";


import { ProjectsModule }
from "./projects/projects.module";


import { QueueModule }
from "./queue/queue.module";

import { ConfigModule }
from "@nestjs/config";

import {
  ThrottlerModule
} from "@nestjs/throttler";


import { SalesModule } from "./sales/sales.module";

import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { EmployeeModule } from "./employee/employee.module";
import { VendorsModule }
from "./vendors/vendors.module";
import { InventoryModule } from "./inventory/inventory.module";
import { FinanceModule } from "./finance/finance.module";

import { HealthModule } from "./health/health.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { ForecastingModule }
from "./forecasting/forecasting.module";

import { NotificationsModule }
from "./notifications/notifications.module";


import { RealtimeModule }
from "./realtime/realtime.module";

import { EventEmitterModule }
from "@nestjs/event-emitter";

import { EventsModule }
from "./events/events.module";

import { AuditModule }
from "./audit/audit.module";

import { HrModule }
from "./hr/hr.module";

import { EmailModule }
from "./email/email.module";

import { UserModule } 
from "./user/user.module";

import {
  ScheduleModule
} from "@nestjs/schedule";

import { SchedulerModule }
from "./scheduler/scheduler.module";

import { ReportsModule }
from "./reports/reports.module";

import { AIModule }
from "./ai/ai.module";

import { InvoicesModule }
from "./invoices/invoices.module";

import { ProfileModule }
from "./profile/profile.module";

@Module({
  imports: [

    ConfigModule.forRoot({
  isGlobal: true,
}),

    PrismaModule,

    ProfileModule,

    AuthModule,

    EmployeeModule,

    VendorsModule,

    InventoryModule,

    FinanceModule,

    HealthModule,
    
    AnalyticsModule,

    InvoicesModule,

    SalesModule,

    ForecastingModule,

    NotificationsModule,

  
    RealtimeModule,

    EventEmitterModule.forRoot(),
    
    EventsModule,

    AuditModule,

    HrModule,
    
    ProjectsModule,

    QueueModule,

    EmailModule,

    AIModule,

    UserModule,

    SchedulerModule,

    ScheduleModule.forRoot(),
    
    ReportsModule,

    ThrottlerModule.forRoot([{

  ttl: 60000,

  limit: 100,
}]),
  ],
})
export class AppModule {}