import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService }
from "../prisma/prisma.service";

import { QueueService }
from "../queue/queue.service";

import { AuditService }
from "../audit/audit.service";

@Injectable()
export class ReportsService {
constructor(

  private prisma:
  PrismaService,

  private queueService:
  QueueService,

  private auditService:
  AuditService

) {}

  // GET REPORTS
  async getReports(
    tenantId: string
  ) {

    return this.prisma.report.findMany({

      where: {
        tenantId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // CREATE REPORT
 async createReport(
  data: any,
  tenantId: string,
  userEmail: string
) {

    const report =
      await this.prisma.report.create({

        data: {
          ...data,
          tenantId,
        },
      });

    // QUEUE EMAIL
    await this.queueService.addEmailJob({

      to: data.email,

      subject:
        `Scheduled Report: ${report.name}`,

      text:
        `Your ${report.type} report has been scheduled successfully.`,
    });

    await this.auditService.createLog({

  action:
    "REPORT_CREATED",

  module:
    "REPORTS",

  description:
    `Created report ${report.name}`,

  userEmail,
    

  tenantId,
});

await this.prisma.notification.create({

  data: {

    title:
      "Report Scheduled",

    message:
      `${report.name} has been scheduled`,

    type:
      "REPORT",

    tenantId,
  },
});
await this.prisma.reportHistory.create({

  data: {

    reportName:
      report.name,

    email:
      report.email,

    status:
      "SENT",

    tenantId:
      report.tenantId,
  },
});

    return report;
  }

  // MARK SENT
 async markSent(
  id: string,
  tenantId: string,
  userEmail: string
){

const existingReport =
  await this.prisma.report.findFirst({

    where: {
      id,
      tenantId,
    },
  });

  if (!existingReport) {

    throw new NotFoundException(
      "Report not found"
    );
  }

  const report =
    await this.prisma.report.update({

      where: {
        id,
      },

      data: {

        status: "SENT",

        lastRun:
          new Date(),
      },
    });

  await this.auditService.createLog({

    action:
      "REPORT_SENT",

    module:
      "REPORTS",

    description:
      `${report.name} marked as sent`,

    userEmail,
      

    tenantId:
      report.tenantId,
  });

  return report;
}

  // REPORT HISTORY
async getHistory(
  tenantId: string
) {

  return this.prisma.reportHistory.findMany({

    where: {
      tenantId,
    },

    orderBy: {

      generatedAt:
        "desc",
    },
  });
}
}