import { Injectable }
from "@nestjs/common";

import { PrismaService }
from "../prisma/prisma.service";

@Injectable()
export class AuditService {

  constructor(
    private prisma: PrismaService
  ) {}

  // CREATE LOG
  async createLog(
    data: any
  ) {

    return this.prisma.auditLog.create({

      data,
    });
  }

  // GET LOGS
  async getLogs(
    tenantId: string
  ) {

    return this.prisma.auditLog.findMany({

      where: {
        tenantId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }
}