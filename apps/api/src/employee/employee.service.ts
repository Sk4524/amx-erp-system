import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "src/audit/audit.service";

@Injectable()
export class EmployeeService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async getAll(
    tenantId: string,
    page = 1,
    limit = 10,
    search = "",
  ) {
    const skip =
      (page - 1) * limit;

    const where = {
      tenantId,

      name: {
        contains: search,
        mode: "insensitive" as const,
      },
    };

    const [employees, total] =
      await Promise.all([
        this.prisma.employee.findMany({
          where,
          skip,
          take: limit,

          orderBy: {
            createdAt: "desc",
          },
        }),

        this.prisma.employee.count({
          where,
        }),
      ]);

    return {
      data: employees,

      pagination: {
        total,
        page,
        limit,

        totalPages:
          Math.ceil(total / limit),
      },
    };
  }

  async create(
    data: any,
    tenantId: string,
    userEmail: string,
  ) {
    const existingEmployee =
      await this.prisma.employee.findFirst({
        where: {
          tenantId,
          name: data.name,
        },
      });

    if (existingEmployee) {
      throw new BadRequestException(
        "Employee already exists",
      );
    }

    const employee =
      await this.prisma.employee.create({
        data: {
          ...data,
          tenantId,
        },
      });

    await this.auditService.createLog({
      action: "EMPLOYEE_CREATED",

      module: "EMPLOYEE",

      description:
        `Created employee ${employee.name}`,

      userEmail,

      tenantId,
    });

    return employee;
  }

  async delete(
    id: string,
    tenantId: string,
    userEmail: string,
  ) {
    const employee =
      await this.prisma.employee.findFirst({
        where: {
          id,
          tenantId,
        },
      });

    if (!employee) {
      throw new NotFoundException(
        "Employee not found",
      );
    }

    const deletedEmployee =
      await this.prisma.employee.delete({
        where: {
          id,
        },
      });

    await this.auditService.createLog({
      action: "EMPLOYEE_DELETED",

      module: "EMPLOYEE",

      description:
        `Deleted employee ${deletedEmployee.name}`,

      userEmail,

      tenantId,
    });

    return deletedEmployee;
  }

  async update(
    id: string,
    data: any,
    tenantId: string,
    userEmail: string,
  ) {
    const employee =
      await this.prisma.employee.findFirst({
        where: {
          id,
          tenantId,
        },
      });

    if (!employee) {
      throw new NotFoundException(
        "Employee not found",
      );
    }

    const updatedEmployee =
      await this.prisma.employee.update({
        where: {
          id,
        },

        data,
      });

    await this.auditService.createLog({
      action: "EMPLOYEE_UPDATED",

      module: "EMPLOYEE",

      description:
        `Updated employee ${updatedEmployee.name}`,

      userEmail,

      tenantId,
    });

    return updatedEmployee;
  }
}