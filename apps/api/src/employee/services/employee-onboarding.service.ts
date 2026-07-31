import {
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { Role } from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../../audit/audit.service";
import { CreateEmployeeDto } from "../dto/create-employee.dto";

@Injectable()
export class EmployeeOnboardingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

private async generateEmployeeCode(): Promise<string> {
  const year = new Date().getFullYear();

  const lastEmployee =
    await this.prisma.employee.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        employeeCode: true,
      },
    });

  let nextNumber = 1;

  if (lastEmployee?.employeeCode) {
    const parts =
      lastEmployee.employeeCode.split("-");

    const last =
      Number(parts[2]);

    if (!Number.isNaN(last)) {
      nextNumber = last + 1;
    }
  }

  return `EMP-${year}-${String(nextNumber).padStart(4, "0")}`;
}

  private generatePassword(): string {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@$";

    let password = "";

    for (let i = 0; i < 10; i++) {
      password += chars.charAt(
        Math.floor(Math.random() * chars.length),
      );
    }

    return password;
  }

  async createEmployeeAccount(
    data: CreateEmployeeDto,
    tenantId: string,
    userEmail: string,
  ) {
    const email = data.email.trim().toLowerCase();

    const existingUser =
      await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      throw new BadRequestException(
        "User with this email already exists",
      );
    }

    const employeeCode =
      await this.generateEmployeeCode();

    const plainPassword =
      data.password || this.generatePassword();

    const hashedPassword =
      await bcrypt.hash(plainPassword, 10);

    const result =
      await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            name: data.name.trim(),
            email,
            phone: data.phone?.trim(),
            password: hashedPassword,
            role: data.role || Role.EMPLOYEE,
            tenant: {
              connect: {
                id: tenantId,
              },
            },
            isApproved: true,
          },
        });

        const employee =
          await tx.employee.create({
            data: {
              user: {
                connect: {
                  id: user.id,
                },
              },
              tenant: {
                connect: {
                  id: tenantId,
                },
              },
              employeeCode,
              name: data.name.trim(),
              email,
              phone: data.phone?.trim(),
              department: data.department?.trim(),
              designation: data.designation?.trim(),
              employmentType:
                data.employmentType || "FULL_TIME",
              salary: data.salary,
              joiningDate: data.joiningDate
  ? new Date(data.joiningDate)
  : new Date(),
            },
          });

        return {
          user,
          employee,
        };
      });

    await this.auditService.createLog({
      action: "EMPLOYEE_CREATED",
      module: "EMPLOYEE",
      description: `Created employee ${result.employee.name}`,
      userEmail,
      tenantId,
    });

    return {
      success: true,
      message: "Employee created successfully",
      credentials: {
        email,
        password: plainPassword,
      },
      data: result.employee,
    };
  }
async approvePendingEmployee(
  pending: any,
  tenantId: string,
  userEmail: string,
) {
  const employeeCode =
    await this.generateEmployeeCode();

  const result =
    await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: pending.name,
          email: pending.email,
          phone: pending.phone,
          password: pending.password, // already hashed
          role: pending.role,
          tenantId,
          isApproved: true,
          isActive: true,
        },
      });

      const employee =
        await tx.employee.create({
          data: {
            userId: user.id,
            tenantId,
            employeeCode,
            name: pending.name,
            email: pending.email,
            phone: pending.phone,
            department: pending.department,
            designation: pending.designation,
            employmentType:
              pending.employmentType || "FULL_TIME",
            salary: pending.salary || 0,
           joiningDate: pending.joiningDate
            ? new Date(pending.joiningDate)
            : new Date(),
                    },
        });

      await tx.pendingEmployee.update({
        where: {
          id: pending.id,
        },
        data: {
          status: "APPROVED",
        },
      });

      return employee;
    });

  await this.auditService.createLog({
    action: "EMPLOYEE_APPROVED",
    module: "EMPLOYEE",
    description: `Approved employee ${pending.name}`,
    userEmail,
    tenantId,
  });

  return {
    success: true,
    message: "Employee approved successfully",
    data: result,
  };
}

}