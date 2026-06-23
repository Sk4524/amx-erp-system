import { Injectable }
from "@nestjs/common";

import {
  Cron,
  CronExpression,
} from "@nestjs/schedule";

import { PrismaService }
from "../prisma/prisma.service";

import { QueueService }
from "../queue/queue.service";

import { ReportGeneratorService }
from "../reports/report-generator.service";

@Injectable()
export class SchedulerService {

  constructor(

    private prisma:
    PrismaService,

    private queueService:
    QueueService,

      private reportGenerator:
  ReportGeneratorService

  ) {}

  // EVERY DAY MIDNIGHT
  @Cron(
    CronExpression.EVERY_DAY_AT_MIDNIGHT
  )
  async dailyCleanup() {

    console.log(

      "Running Daily ERP Cleanup Job..."
    );
  }

  // EVERY MONDAY
  @Cron(
    CronExpression.EVERY_WEEK
  )
  async weeklyForecastRetraining() {

    console.log(

      "Running Weekly AI Forecast Retraining..."
    );
  }

  // EVERY HOUR
  @Cron(
    CronExpression.EVERY_HOUR
  )
  async hourlyInventoryCheck() {

    console.log(

      "Running Inventory Health Check..."
    );
  }

  // EVERY DAY 9 AM
  @Cron("0 9 * * *")
  async processReports() {

    console.log(
      "Processing Scheduled Reports..."
    );

    const reports =
      await this.prisma.report.findMany({

        where: {
          status: "SCHEDULED",
        },
      });
for (const report of reports) {

  const inventory =
    await this.prisma.inventory.count({

      where: {
        tenantId: report.tenantId,
      },
    });

  const employees =
    await this.prisma.employee.count({

      where: {
        tenantId: report.tenantId,
      },
    });

  const revenue =
    await this.prisma.salesOrder.aggregate({

      where: {
        tenantId: report.tenantId,
      },

      _sum: {
        totalAmount: true,
      },
    });

  const reportText = `
ERP BUSINESS REPORT

Report Name:
${report.name}

Employees:
${employees}

Inventory Items:
${inventory}

Revenue:
₹${revenue._sum.totalAmount || 0}

Generated:
${new Date().toLocaleString()}
`;
const pdfPath =
  await this.reportGenerator.generatePDF(

    report.name,

    reportText,

    report.email,

    report.tenantId
  );

const excelPath =
  await this.reportGenerator.generateExcel(

    report.name,

    [
      {
        field: "Employees",
        value: employees,
      },

      {
        field: "Inventory",
        value: inventory,
      },

      {
        field: "Revenue",
        value:
          revenue._sum.totalAmount || 0,
      },
    ],

    report.email,

    report.tenantId
  );
 await this.queueService.addEmailJob({

  to: report.email,

  subject:
    `ERP Report: ${report.name}`,

  text:
    reportText,

  attachments: [

  pdfPath,

  excelPath,
]
});
  await this.prisma.report.update({

  where: {
    id: report.id,
  },

  data: {

    status: "SENT",

    lastRun:
      new Date(),
  },
});

// REPORT HISTORY
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
}
  }
}