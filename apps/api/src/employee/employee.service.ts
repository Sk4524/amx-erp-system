import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "src/audit/audit.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";

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

  OR: [

    {
      name: {
        contains: search,
        mode: "insensitive" as const,
      },
    },

    {
      position: {
        contains: search,
        mode: "insensitive" as const,
      },
    },

  ],

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

  async create(
    data: CreateEmployeeDto,
    tenantId: string,
    userEmail: string,
  ) {
    data.name = data.name.trim();
data.position = data.position.trim();
    const existingEmployee =
      await this.prisma.employee.findFirst({
       where:{
tenantId,
name:{
equals:data.name,
mode:"insensitive"
}
}
      });

    if (existingEmployee) {
      throw new BadRequestException(
        "Employee already exists",
      );
    }



    if (data.salary < 0) {

throw new BadRequestException(
"Salary cannot be negative",
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

    return {

  success: true,

  message: "Employee created successfully",

  data: employee,

};
  }

async createBulk(
data: CreateEmployeeDto[],
tenantId: string,
userEmail: string,
) {

const employees=data.map(emp=>({

name:emp.name.trim(),

position:emp.position.trim(),

salary:emp.salary,

tenantId,

}));

const result=
await this.prisma.employee.createMany({

data:employees,

skipDuplicates:true,

});

await this.auditService.createLog({

action:"EMPLOYEE_BULK_CREATED",

module:"EMPLOYEE",

description:`Imported ${result.count} employees`,

userEmail,

tenantId,

});

return {

  success: true,

  message: `${result.count} employees imported successfully`,

  data: result,

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
      await this.prisma.employee.update({
        where: {
          id,
        },

        data:{
...data,

name:data.name?.trim(),

position:data.position?.trim(),

},
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