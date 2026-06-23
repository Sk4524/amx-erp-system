import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService }
from "../prisma/prisma.service";

import { AuditService }
from "../audit/audit.service";

@Injectable()
export class ProjectsService {

  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  // GET PROJECTS
  async getProjects(
    tenantId: string
  ) {

    return this.prisma.project.findMany({

      where: {
        tenantId,
      },

      include: {
        tasks: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // CREATE PROJECT
async createProject(
  data: any,
  tenantId: string,
  userEmail: string
) {

    const project =
      await this.prisma.project.create({

        data: {
          ...data,
          tenantId,
        },
      });

    await this.auditService.createLog({

      action:
        "PROJECT_CREATED",

      module:
        "PROJECTS",

      description:
        `Created project ${project.name}`,

      userEmail,

      tenantId,
    });

    return project;
  }

  // UPDATE PROJECT
 async updateProject(
  id: string,
  data: any,
  tenantId: string,
  userEmail: string
) {

    const project =
  await this.prisma.project.findFirst({

    where: {
      id,
      tenantId,
    },
  });

    if (!project) {

      throw new NotFoundException(
        "Project not found"
      );
    }

    const updatedProject =
      await this.prisma.project.update({

        where: {
          id,
        },

        data,
      });

    await this.auditService.createLog({

      action:
        "PROJECT_UPDATED",

      module:
        "PROJECTS",

      description:
        `Updated project ${updatedProject.name}`,

      userEmail,
      

      tenantId:
        updatedProject.tenantId,
    });

    return updatedProject;
  }

  // DELETE PROJECT
async deleteProject(
  id: string,
  tenantId: string,
  userEmail: string
){

    const project =
  await this.prisma.project.findFirst({

    where: {
      id,
      tenantId,
    },
  });

    if (!project) {

      throw new NotFoundException(
        "Project not found"
      );
    }

    await this.prisma.task.deleteMany({

      where: {
        projectId: id,
      },
    });

    await this.auditService.createLog({

      action:
        "PROJECT_DELETED",

      module:
        "PROJECTS",

      description:
        `Deleted project ${project.name}`,

      userEmail,
        

      tenantId:
        project.tenantId,
    });

    return this.prisma.project.delete({

      where: {
        id,
      },
    });
  }

  // CREATE TASK
  async createTask(
  data: any,
  tenantId: string,
  userEmail: string
){

    const task =
  await this.prisma.task.create({

    data: {
      ...data,
      tenantId,
      status:
        data.status || "PENDING",
    },
  });

    await this.auditService.createLog({

      action:
        "TASK_CREATED",

      module:
        "PROJECTS",

      description:
        `Created task ${task.title}`,

      userEmail,
        

      tenantId,
    });

    return task;
  }

  // UPDATE TASK
async updateTask(
  id: string,
  data: any,
  tenantId: string,
  userEmail: string
){

    const task =
  await this.prisma.task.findFirst({

    where: {
      id,
      tenantId,
    },
  });
    if (!task) {

      throw new NotFoundException(
        "Task not found"
      );
    }

    const updatedTask =
      await this.prisma.task.update({

        where: {
          id,
        },

        data,
      });

    await this.auditService.createLog({

      action:
        "TASK_UPDATED",

      module:
        "PROJECTS",

      description:
        `Updated task ${updatedTask.title}`,

      userEmail,
        

      tenantId:
        updatedTask.tenantId,
    });

    return updatedTask;
  }

  // DELETE TASK
async deleteTask(
  id: string,
  tenantId: string,
  userEmail: string
){

    const task =
  await this.prisma.task.findFirst({

    where: {
      id,
      tenantId,
    },
  });
    if (!task) {

      throw new NotFoundException(
        "Task not found"
      );
    }

    await this.auditService.createLog({

      action:
        "TASK_DELETED",

      module:
        "PROJECTS",

      description:
        `Deleted task ${task.title}`,

      userEmail,
        

      tenantId:
        task.tenantId,
    });

    return this.prisma.task.delete({

      where: {
        id,
      },
    });
  }
}