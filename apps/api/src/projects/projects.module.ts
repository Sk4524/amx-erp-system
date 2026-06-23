import { Module }
from "@nestjs/common";

import { ProjectsController }
from "./projects.controller";

import { ProjectsService }
from "./projects.service";
import { AuditModule }
from "../audit/audit.module";

import { PrismaModule }
from "../prisma/prisma.module";

@Module({

  imports: [
    PrismaModule,
    AuditModule,
  ],

  controllers: [
    ProjectsController,
  ],

  providers: [
    ProjectsService,
  ],
})
export class ProjectsModule {}