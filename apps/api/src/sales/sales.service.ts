import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";

import { FinanceService }
from "../finance/finance.service";

import { InvoicesService }
from "../invoices/invoices.service";

import { AuditService }
from "../audit/audit.service";

import { PrismaService } from "../prisma/prisma.service";

import { RedisService }
from "../redis/redis.service";

import { RealtimeGateway }
from "../realtime/realtime.gateway";

@Injectable()
export class SalesService {

 constructor(

  private prisma:
  PrismaService,

  private redisService:
  RedisService,

  private realtimeGateway:
  RealtimeGateway,

  private auditService:
  AuditService,

  private financeService:
  FinanceService,

  private invoicesService:
  InvoicesService,

) {}

  // GET CUSTOMERS
  async getCustomers(
    tenantId: string
  ) {

    return this.prisma.customer.findMany({

      where: {
        tenantId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // CREATE CUSTOMER
async createCustomer(
  data: any,
  tenantId: string,
  userEmail: string
) {

  const existingCustomer =
    await this.prisma.customer.findFirst({

      where: {

        tenantId,

        email: data.email,
      },
    });

  if (
    existingCustomer &&
    data.email
  ) {

    throw new BadRequestException(
      "Customer already exists"
    );
  }

  const customer =
    await this.prisma.customer.create({

      data: {
        ...data,
        tenantId,
      },
    });

  await this.auditService.createLog({

    action:
      "CUSTOMER_CREATED",

    module:
      "SALES",

    description:
      `Created customer ${customer.name}`,

    userEmail,
      

    tenantId,
  });

  return customer;
}

  // GET SALES ORDERS
  async getSalesOrders(
    tenantId: string
  ) {

    return this.prisma.salesOrder.findMany({

      where: {
        tenantId,
      },

      include: {
        customer: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // CREATE SALES ORDER
  async createSalesOrder(
  data: any,
  tenantId: string,
  userEmail: string
) {
 if (Number(data.quantity) <= 0) {

    throw new BadRequestException(
      "Quantity must be greater than zero"
    );
  }

  if (Number(data.price) <= 0) {

    throw new BadRequestException(
      "Price must be greater than zero"
    );
  }

    // FIND INVENTORY
    const inventory =
      await this.prisma.inventory.findFirst({

        where: {

          tenantId,

          productName:
            data.productName,
        },
      });

    if (!inventory) {

      throw new NotFoundException(
  "Product not found"
);
    }

    // CHECK STOCK
    if (
      inventory.quantity <
      Number(data.quantity)
    ) {

     throw new BadRequestException(
  "Insufficient stock"
);
    }

    const customer =
  await this.prisma.customer.findFirst({

    where: {

      id: data.customerId,

      tenantId,
    },
  });

if (!customer) {

  throw new NotFoundException(
    "Customer not found"
  );
}


    // CREATE ORDER
    const order =
      await this.prisma.salesOrder.create({

        data: {

          customerId:
            data.customerId,

          productName:
            data.productName,

          quantity:
            Number(data.quantity),

          price:
            Number(data.price),

          totalAmount:
            Number(data.quantity) *
            Number(data.price),

          tenantId,
        },
      });

    // UPDATE INVENTORY
    const updatedInventory =
      await this.prisma.inventory.update({

        where: {
          id: inventory.id,
        },

        data: {

          quantity: {

            decrement:
              Number(data.quantity),
          },
        },
      });

    // CLEAR FORECAST CACHE
    await this.redisService.set(

      `forecast:${tenantId}`,

      ""
    );

    // STOCK MOVEMENT
    await this.prisma.stockMovement.create({

      data: {

        type: "STOCK_OUT",

        productName:
          data.productName,

        quantity:
          Number(data.quantity),

        reference:
          order.id,

        tenantId,
      },
    });

    // REALTIME SALES EVENT
    this.realtimeGateway
      .salesUpdated({

        productName:
          data.productName,

        quantity:
          Number(data.quantity),

        totalAmount:
          order.totalAmount,

        tenantId,
      });

    // REALTIME INVENTORY EVENT
    this.realtimeGateway
      .inventoryUpdated({

        productName:
          updatedInventory.productName,

        currentStock:
          updatedInventory.quantity,

        tenantId,
      });

    // LOW STOCK ALERT
    if (
      updatedInventory.quantity <= 5
    ) {

      this.realtimeGateway
        .sendNotification({

          type:
            "LOW_STOCK",

          title:
            "Low Stock Alert",

          message:
            `${updatedInventory.productName} stock is low (${updatedInventory.quantity} remaining)`,

          tenantId,
        });
    }

    await this.financeService.createTransaction(

  {

    amount:
      order.totalAmount,

    type:
      "INCOME",

    reference:
      `Sales Order ${order.id}`,

  },

  tenantId,

  userEmail,

);

await this.invoicesService.createInvoice(

  {

    customerName:
      customer.name,

    amount:
      order.totalAmount,

    dueDate:
      new Date(
        Date.now() +
        7 * 24 * 60 * 60 * 1000,
      ).toISOString(),

  },

  tenantId,

);
    // DASHBOARD REFRESH
    this.realtimeGateway
      .dashboardRefresh();

      await this.auditService.createLog({

  action:
    "SALES_ORDER_CREATED",

  module:
    "SALES",

  description:
    `Created sales order for ${order.productName} Qty ${order.quantity}`,

  userEmail,
    

  tenantId,
});

    return order;

    
  }
}