import {
  Injectable,
  BadRequestException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class PayrollService {

  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
    private notificationsService: NotificationsService,
  ) {}

  // GENERATE PAYROLL
  async generatePayroll(
    data: any,
    tenantId: string,
    userEmail: string,
  ) {

    const employee =
      await this.prisma.employee.findFirst({

        where: {
          id: data.employeeId,
          tenantId,
        },

      });

    if (!employee) {

      throw new BadRequestException(
        "Employee not found",
      );

    }

    const grossSalary =
      data.basicSalary +
      data.allowances;

    const netSalary =
      grossSalary -
      data.deductions;

   const employeeCount =
  await this.prisma.payroll.count({

    where: {
      tenantId,
    },

  });

const payslipNumber =
  `PAY-${new Date().getFullYear()}${String(
    new Date().getMonth() + 1,
  ).padStart(2, "0")}-${String(
    employeeCount + 1,
  ).padStart(4, "0")}`;

const payroll =
  await this.prisma.payroll.create({

    data: {

      employeeId: employee.id,

      tenantId,

      month: data.month,

      payslipNumber,

      basicSalary: data.basicSalary,

      allowances: data.allowances,

      deductions: data.deductions,

      grossSalary,

      netSalary,

    },

  });

    await this.auditService.createLog({

      action:
        "PAYROLL_GENERATED",

      module:
        "PAYROLL",

      description:
        `Payroll generated for ${employee.name}`,

      userEmail,

      tenantId,

    });

    await this.notificationsService.create(

      {

        title:
          "Payroll Generated",

        message:
          `Payroll generated for ${employee.name}`,

        type:
          "PAYROLL",

      },

      tenantId,

    );

    return {

      success: true,

      data: {

        payrollId:
          payroll.id,

        employee,

        month:
          data.month,

        basicSalary:
          data.basicSalary,

        allowances:
          data.allowances,

        deductions:
          data.deductions,

        grossSalary,

        netSalary,

      },

    };

  }

  // PAYROLL HISTORY
  async getPayrollHistory(
    tenantId: string,
  ) {

    return this.prisma.payroll.findMany({

        where: {
    tenantId,
  },

  include: {
    employee: true,
  },

  orderBy: {
    generatedAt: "desc",
  },

});

  }

  // EMPLOYEE PAYROLL
  async getEmployeePayroll(
    employeeId: string,
    tenantId: string,
  ) {

    const employee =
      await this.prisma.employee.findFirst({

        where: {

          id: employeeId,

          tenantId,

        },

      });

    if (!employee) {

      throw new BadRequestException(
        "Employee not found",
      );

    }

   return this.prisma.payroll.findMany({

  where: {

    tenantId,

    employeeId,

  },

  orderBy: {

    generatedAt: "desc",

  },

});

  }

}