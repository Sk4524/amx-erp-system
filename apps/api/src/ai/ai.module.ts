import { Module } from "@nestjs/common";

import { AIController }
from "./ai.controller";

import { AIService }
from "./ai.service";

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
  ],

   exports: [

    AIService,

    DashboardAIService,

],
})

export class AIModule {}