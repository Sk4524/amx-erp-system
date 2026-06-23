import {
  Injectable
} from "@nestjs/common";

import { PrismaService }
from "../prisma/prisma.service";

import { AuditService }
from "../audit/audit.service";

@Injectable()
export class InvoicesService {

  constructor(

    private prisma:
    PrismaService,

    private auditService:
    AuditService

  ) {}

  async getInvoices(
    tenantId: string
  ) {

    return this.prisma.invoice.findMany({

      where: {
        tenantId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async createInvoice(
    data: any,
    tenantId: string
  ) {

    const invoice =
      await this.prisma.invoice.create({

        data: {

          invoiceNumber:
            `INV-${Date.now()}`,

          customerName:
            data.customerName,

          amount:
            Number(data.amount),

          dueDate:
            new Date(
              data.dueDate
            ),

          tenantId,
        },
      });

    await this.auditService
      .createLog({

        action:
          "INVOICE_CREATED",

        module:
          "INVOICES",

        description:
          `Invoice ${invoice.invoiceNumber} created`,

        userEmail:
          "SYSTEM",

        tenantId,
      });

    return invoice;
  }

  async markPaid(
    id: string
  ) {

    return this.prisma.invoice.update({

      where: {
        id,
      },

      data: {
        status: "PAID",
      },
    });
  }
}