import { Module } from "@nestjs/common";

import { AIController }
from "./ai.controller";

import { AIService }
from "./ai.service";

import { FinanceAIService }
from "./services/finance-ai.service";

import { PrismaModule }
from "../prisma/prisma.module";
import { DashboardAIService }
from "./services/dashboard-ai.service";
@Module({

  imports: [

    PrismaModule
  ],

  controllers: [

    AIController
  ],

  providers: [

    AIService,

    DashboardAIService,
    FinanceAIService
  ],

   exports: [

    AIService,

    DashboardAIService,

],
})

export class AIModule {}