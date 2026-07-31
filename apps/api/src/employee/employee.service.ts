import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "src/audit/audit.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { EmployeeOnboardingService } from "./services/employee-onboarding.service";
@Injectable()
export class EmployeeService {
  constructor(
  private prisma: PrismaService,
  private auditService: AuditService,
  private onboardingService: EmployeeOnboardingService,
) {}


async create(
  data: CreateEmployeeDto,
  tenantId: string,
  userEmail: string,
) {
  return this.onboardingService.createEmployeeAccount(
    data,
    tenantId,
    userEmail,
  );
}

async bulkCreate(
  employees: CreateEmployeeDto[],
  tenantId: string,
  userEmail: string,
) {
  const created = [];
  const failed = [];

  for (const employee of employees) {
    try {
   const result =
  await this.onboardingService.createEmployeeAccount(
    employee,
    tenantId,
    userEmail,
  );

      created.push(result.data);
    } catch (error: any) {
      failed.push({
        email: employee.email,
        reason: error.message,
      });
    }
  }

  return {
    success: true,
    summary: {
      total: employees.length,
      created: created.length,
      failed: failed.length,
    },
    created,
    failed,
  };
}

async getAll(
  tenantId: string,
  page = 1,
  limit = 10,
  search = "",
  department?: string,
  designation?: string,
  status?: string,
  employmentType?: string,
  sortBy = "createdAt",
  sortOrder: "asc" | "desc" = "desc",
){
    const skip =
      (page - 1) * limit;


      const where = {
  tenantId,

  ...(search.trim()
    ? {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            employeeCode: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            department: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            designation: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            phone: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            status: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : {}),

  ...(department
    ? {
        department,
      }
    : {}),

  ...(designation
    ? {
        designation,
      }
    : {}),

  ...(status
    ? {
        status,
      }
    : {}),

  ...(employmentType
    ? {
        employmentType,
      }
    : {}),
};

const allowedSortFields = [
  "createdAt",
  "name",
  "email",
  "department",
  "designation",
  "salary",
  "joiningDate",
  "employeeCode",
];

const orderField = allowedSortFields.includes(sortBy)
  ? sortBy
  : "createdAt";

const [employees, total] = await Promise.all([
  this.prisma.employee.findMany({
    where,
    skip,
    take: limit,

    orderBy: {
      [orderField]: sortOrder,
    },
  }),

  this.prisma.employee.count({
    where,
  }),
]);   

return {
  success: true,

  data: employees,

  pagination: {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  },
};
  }


async getOne(
  id: string,
  tenantId: string,
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

  return {

    success: true,

    message: "Employee fetched successfully",

    data: employee,

  };

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

    // Prevent deleting employee having related records
// Check related records before deleting

const attendanceCount =
  await this.prisma.attendance.count({

    where: {
      employeeId: id,
    },

  });

const leaveCount =
  await this.prisma.leave.count({

    where: {
      employeeId: id,
    },

  });

const transactionCount =
  await this.prisma.transaction.count({

    where: {
      employeeId: id,
    },

  });

if (

  attendanceCount > 0 ||

  leaveCount > 0 ||

  transactionCount > 0

) {

  throw new BadRequestException(

    "Cannot delete employee because related records exist."

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

    return {

  success: true,

  message: "Employee deleted successfully",

  data: deletedEmployee,

};
  }

  async update(
    id: string,
  data: UpdateEmployeeDto,
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


    if (data.name) {

  const existing =
    await this.prisma.employee.findFirst({

      where: {

        tenantId,

        name: data.name,

        NOT: {

          id,

        },

      },

    });

  if (existing) {

    throw new BadRequestException(

      "Employee name already exists"

    );

  }

}
    const updatedEmployee =
  await this.prisma.$transaction(async (tx) => {

    await tx.user.update({
      where: {
        id: employee.userId,
      },

      data: {
        name: data.name?.trim(),
        email: data.email?.trim().toLowerCase(),
        phone: data.phone?.trim(),
      },
    });

    return tx.employee.update({
      where: {
        id,
      },

      data: {
        ...data,

        name: data.name?.trim(),

        email: data.email?.trim().toLowerCase(),

        phone: data.phone?.trim(),

        department: data.department?.trim(),

        designation: data.designation?.trim(),

        joiningDate: data.joiningDate
          ? new Date(data.joiningDate)
          : undefined,
      },
    });

  });
    await this.auditService.createLog({
      action: "EMPLOYEE_UPDATED",

      module: "EMPLOYEE",

      description:
        `Updated employee ${updatedEmployee.name}`,

      userEmail,

      tenantId,
    });

    return {

  success: true,

  message: "Employee updated successfully",

  data: updatedEmployee,

};
  }
}