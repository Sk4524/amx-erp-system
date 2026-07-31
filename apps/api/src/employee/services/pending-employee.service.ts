import { Injectable } from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";

import { EmployeeOnboardingService } from "./employee-onboarding.service";
import {
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";

import { Role } from "@prisma/client";
@Injectable()
export class PendingEmployeeService {
  constructor(
    private prisma: PrismaService,
    private onboardingService: EmployeeOnboardingService,
  ) {}

  async getAllPending(tenantId: string) {
    return this.prisma.pendingEmployee.findMany({
      where: {
        tenantId,
        status: "PENDING",
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  async approvePendingEmployee(
  pendingId: string,
  tenantId: string,
  userEmail: string,
) {
  const pending =
    await this.prisma.pendingEmployee.findFirst({
      where: {
        id: pendingId,
        tenantId,
      },
    });

  if (!pending) {
    throw new NotFoundException(
      "Pending employee not found",
    );
  }

  if (pending.status !== "PENDING") {
    throw new BadRequestException(
      "Employee already processed",
    );
  }

  return this.onboardingService.approvePendingEmployee(
    pending,
    tenantId,
    userEmail,
  );
}

async rejectPendingEmployee(
  pendingId: string,
  tenantId: string,
  userEmail: string,
) {
  const pending =
    await this.prisma.pendingEmployee.findFirst({
      where: {
        id: pendingId,
        tenantId,
      },
    });

  if (!pending) {
    throw new NotFoundException(
      "Pending employee not found",
    );
  }

  if (pending.status !== "PENDING") {
    throw new BadRequestException(
      "Employee already processed",
    );
  }

  await this.prisma.pendingEmployee.update({
    where: {
      id: pending.id,
    },
    data: {
      status: "REJECTED",
    },
  });

  return {
    success: true,
    message: "Employee registration rejected.",
  };
}

  
}