import {
  Injectable,
  InternalServerErrorException
} from "@nestjs/common";

import { PrismaService }
from "../prisma/prisma.service";

import { AuditService }
from "../audit/audit.service";

import { NotificationsService }
from "../notifications/notifications.service";

import PDFDocument from "pdfkit";

import * as ExcelJS from "exceljs";

import * as fs from "fs";
import * as path from "path";

@Injectable()
export class ReportGeneratorService {

  constructor(

    private prisma:
    PrismaService,

    private auditService:
    AuditService,

    private notificationsService:
    NotificationsService

  ) {}
private async logReportGeneration(

  reportName: string,

  email: string,

  tenantId: string,

  format: string

) {

  await this.prisma.reportHistory.create({

    data: {

      reportName,

      email,

      status: "GENERATED",

      tenantId,
    },
  });

  await this.auditService.createLog({

    action:
      "REPORT_GENERATED",

    module:
      "REPORTS",

    description:
      `${reportName} generated (${format})`,

    userEmail:
      email,

    tenantId,
  });

  await this.notificationsService.create(

    {

      title:
        "Report Generated",

      message:
        `${reportName} generated successfully`,

      type:
        "REPORT",

    },

    tenantId
  );
}

 async generatePDF(
  reportName: string,
  content: string,
  email: string,
  tenantId: string
)  {

  try {

    const reportsDir =
      path.join(
        process.cwd(),
        "reports"
      );

    if (
      !fs.existsSync(
        reportsDir
      )
    ) {

      fs.mkdirSync(
        reportsDir,
        {
          recursive: true
        }
      );
    }

    const filePath =
      path.join(
        reportsDir,
        `${Date.now()}.pdf`
      );

    const doc =
      new PDFDocument();

    doc.pipe(
      fs.createWriteStream(
        filePath
      )
    );

    doc.fontSize(22);

    doc.text(reportName);

    doc.moveDown();

    doc.fontSize(12);

    doc.text(content);

   await new Promise<void>((resolve) => {

  doc.on("end", () => {

    resolve();
  });

  doc.end();
});

await this.logReportGeneration(

  reportName,

  email,

  tenantId,

  "PDF"
);

    return filePath;

  } catch (error) {

    throw new InternalServerErrorException(
      "PDF generation failed"
    );
  }
}

  async generateExcel(
  reportName: string,
  rows: any[],
  email: string,
  tenantId: string
) {

  try {

    const reportsDir =
      path.join(
        process.cwd(),
        "reports"
      );

    if (
      !fs.existsSync(
        reportsDir
      )
    ) {

      fs.mkdirSync(
        reportsDir,
        {
          recursive: true
        }
      );
    }

    const workbook =
      new ExcelJS.Workbook();

    const sheet =
      workbook.addWorksheet(
        "Report"
      );

    sheet.columns = [

      {
        header: "Field",
        key: "field",
      },

      {
        header: "Value",
        key: "value",
      },
    ];

    rows.forEach(
      (row) =>
        sheet.addRow(row)
    );

    const filePath =
      path.join(
        reportsDir,
        `${Date.now()}.xlsx`
      );

    await workbook.xlsx.writeFile(
      filePath
    );

await this.logReportGeneration(

  reportName,

  email,

  tenantId,

  "EXCEL"
);

    return filePath;

  } catch (error) {

    throw new InternalServerErrorException(
      "Excel generation failed"
    );
  }
}
}
