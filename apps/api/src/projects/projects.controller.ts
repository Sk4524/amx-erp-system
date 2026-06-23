import {
  Controller,
  Get,
  Post,
 Put,
 Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from "@nestjs/common";

import { CreateProjectDto }
from "./dto/create-project.dto";

import { CreateTaskDto }
from "./dto/create-task.dto";

import { ProjectsService }
from "./projects.service";

import { JwtAuthGuard }
from "../auth/jwt.guard";

import { RolesGuard }
from "../auth/roles.guard";

import { UpdateTaskDto }
from "./dto/update-task.dto";

import { Roles }
from "../auth/roles.decorator";

import {
  ApiBearerAuth,
  ApiTags,
} from "@nestjs/swagger";

@UseGuards(
  JwtAuthGuard,
  RolesGuard
)

@ApiTags("Projects")

@ApiBearerAuth()

@Controller("projects")
export class ProjectsController {

  constructor(
    private service:
    ProjectsService
  ) {}

  // GET PROJECTS
  @Get()
  @Roles(
  "ADMIN",
  "MANAGER",
  "EMPLOYEE"
)
  getProjects(
    @Req() req: any
  ) {

    return this.service.getProjects(
      req.user.tenantId
    );
  }

  // CREATE PROJECT
  @Post()
  @Roles(
  "ADMIN",
  "MANAGER"
)
  createProject(
    @Body() body: CreateProjectDto,
    @Req() req: any
  ) {

    return this.service.createProject(

  body,

  req.user.tenantId,

  req.user.email
);
  }

  // UPDATE PROJECT
@Put(":id")
@Roles(
  "ADMIN",
  "MANAGER"
)
updateProject(
  @Param("id") id: string,
  @Body() body: CreateProjectDto,
  @Req() req: any
) {

  return this.service.updateProject(
  id,
  body,
  req.user.tenantId,
  req.user.email
);
}


// DELETE PROJECT
@Delete(":id")
@Roles("ADMIN")
deleteProject(
  @Param("id") id: string,
  @Req() req: any
) {

 return this.service.deleteProject(
  id,
  req.user.tenantId,
  req.user.email
);
}
  // CREATE TASK
  @Post("task")
  @Roles(
  "ADMIN",
  "MANAGER"
)
  createTask(
    @Body() body: CreateTaskDto,
    @Req() req: any
  ) {

   return this.service.createTask(

  body,

  req.user.tenantId,

  req.user.email
);
  }

  // UPDATE TASK
@Put("task/:id")
@Roles(
  "ADMIN",
  "MANAGER",
  "EMPLOYEE"
)
updateTask(
  @Param("id") id: string,
  @Body() body: UpdateTaskDto,
  @Req() req: any
) {

 return this.service.updateTask(
  id,
  body,
  req.user.tenantId,
  req.user.email
);
}
  // DELETE TASK
@Delete("task/:id")
@Roles(
  "ADMIN",
  "MANAGER"
)
deleteTask(
  @Param("id") id: string,
  @Req() req: any
) {

 return this.service.deleteTask(
  id,
  req.user.tenantId,
  req.user.email
);
}
}