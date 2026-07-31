import {
  Injectable,
  NotFoundException,
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
  tenantId: string,
  search = "",
) {

  const invoices =
    await this.prisma.invoice.findMany({

      where: {

        tenantId,

        OR: [

          {

            customerName: {

              contains: search,

              mode: "insensitive",

            },

          },

          {

            invoiceNumber: {

              contains: search,

              mode: "insensitive",

            },

          },

        ],

      },

      orderBy: {

        createdAt: "desc",

      },

    });

  return {

    success: true,

    data: invoices,

  };

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

  async getInvoiceSummary(
  tenantId: string,
) {

  const [
    totalInvoices,
    pendingInvoices,
    paidInvoices,
    invoices,
  ] = await Promise.all([

    this.prisma.invoice.count({
      where: {
        tenantId,
      },
    }),

    this.prisma.invoice.count({
      where: {
        tenantId,
        status: "PENDING",
      },
    }),

    this.prisma.invoice.count({
      where: {
        tenantId,
        status: "PAID",
      },
    }),

    this.prisma.invoice.findMany({
      where: {
        tenantId,
      },
      select: {
        amount: true,
      },
    }),

  ]);

  const totalAmount =
    invoices.reduce(

      (sum, invoice) =>
        sum + invoice.amount,

      0,

    );

  return {

    success: true,

    data: {

      totalInvoices,

      pendingInvoices,

      paidInvoices,

      totalAmount,

    },

  };

}

async getInvoiceById(
  id: string,
  tenantId: string,
) {

  const invoice =
    await this.prisma.invoice.findFirst({

      where: {

        id,

        tenantId,

      },

    });

  if (!invoice) {

  throw new NotFoundException(
  "Invoice not found",
);

  }

  return {

    success: true,

    data: invoice,

  };

}

async getInvoiceAnalytics(
  tenantId: string,
) {

  const [
    pending,
    paid,
  ] = await Promise.all([

    this.prisma.invoice.count({

      where: {

        tenantId,

        status: "PENDING",

      },

    }),

    this.prisma.invoice.count({

      where: {

        tenantId,

        status: "PAID",

      },

    }),

  ]);

  return {

    success: true,

    data: {

      pending,

      paid,

    },

  };

}

async getMonthlyInvoiceAnalytics(
  tenantId: string,
) {

  const invoices =
    await this.prisma.invoice.findMany({

      where: {
        tenantId,
      },

      orderBy: {
        createdAt: "asc",
      },

      select: {
        createdAt: true,
        amount: true,
      },

    });

  const monthly: Record<
    string,
    {
      invoices: number;
      amount: number;
    }
  > = {};

  for (const invoice of invoices) {

    const month =
      invoice.createdAt.toLocaleString(
        "en-US",
        {
          month: "short",
          year: "numeric",
        },
      );

    if (!monthly[month]) {

      monthly[month] = {

        invoices: 0,

        amount: 0,

      };

    }

    monthly[month].invoices++;

    monthly[month].amount +=
      invoice.amount;

  }

  return {

    success: true,

    data: Object.entries(monthly).map(

      ([month, value]) => ({

        month,

        ...value,

      }),

    ),

  };

}

}