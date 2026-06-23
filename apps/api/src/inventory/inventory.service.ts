import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

import { EventEmitter2 }
from "@nestjs/event-emitter";

import { AuditService }
from "../audit/audit.service";

import { NotificationsService }
from "../notifications/notifications.service";

import {
  RealtimeGateway
}
from "../realtime/realtime.gateway";

@Injectable()
export class InventoryService {
constructor(

  private prisma:
  PrismaService,

  private eventEmitter:
  EventEmitter2,

  private auditService:
  AuditService,

  private realtimeGateway:
  RealtimeGateway,

  private notificationsService:
  NotificationsService

) {}

  // GET ALL INVENTORY
  async getAll(
    tenantId: string,
    search = ""
  ) {

    return this.prisma.inventory.findMany({

      where: {

        tenantId,

        productName: {
          contains: search,
          mode: "insensitive",
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

// CREATE
async create(
  data: any,
  tenantId: string,
  userEmail = "SYSTEM"
) {

if (data.quantity < 0) {

  throw new BadRequestException(
    "Quantity cannot be negative"
  );
}

if (data.price < 0) {

  throw new BadRequestException(
    "Price cannot be negative"
  );
}

if (!data.sku?.trim()) {

  throw new BadRequestException(
    "SKU is required"
  );
}
const existingSku =
  await this.prisma.inventory.findFirst({

    where: {

      tenantId,

      sku: data.sku,
    },
  });

if (existingSku) {

  throw new BadRequestException(
    "SKU already exists"
  );
}
  const item =
  await this.prisma.inventory.create({

    data: {
      ...data,
      tenantId,
    },
  });

this.realtimeGateway
  .inventoryUpdated({

    action: "CREATE",

    product:
      item.productName,
  });

this.realtimeGateway
  .dashboardRefresh();

  await this.notificationsService
  .create(

{
  title:
    "Inventory Added",

  message:
    `${item.productName} added to inventory`,

  type:
    "SUCCESS",
},

tenantId
);

  // LOW STOCK EVENT
  if (item.quantity <= 5) {

  await this.notificationsService
    .create(

{
  title:
    "Low Stock Alert",

  message:
    `${item.productName} stock is only ${item.quantity}`,

  type:
    "WARNING",
},

tenantId
);

  this.eventEmitter.emit(
    "inventory.low_stock",
    {
      productName:
        item.productName,

      tenantId,
    }
  );
}
  // AUDIT LOG
  await this.auditService.createLog({

    action: "CREATE",

    module: "INVENTORY",

    description:
      `Created inventory item ${item.productName}`,

    userEmail,

    tenantId,
  });

  return item;
}


  // DELETE INVENTORY
async delete(
  id: string,
  tenantId: string,
  userEmail: string
){

  const existing =
    await this.prisma.inventory.findFirst({

      where: {

        id,

        tenantId,
      },
    });

  if (!existing) {

   throw new NotFoundException(
  "Inventory item not found"
);
  }
  const item =
    await this.prisma.inventory.delete({

      where: { id },
    });

  await this.notificationsService
    .create(

{
  title:
    "Inventory Deleted",

  message:
    `${item.productName} removed from inventory`,

  type:
    "DANGER",
},

item.tenantId
);

this.realtimeGateway
  .inventoryUpdated({

    action: "DELETE",

    product:
      item.productName,
  });

this.realtimeGateway
  .dashboardRefresh();

await this.auditService.createLog({

  action: "DELETE",

  module: "INVENTORY",

  description:
    `Deleted inventory item ${item.productName}`,

  userEmail,

  tenantId,
});

return item;
}


  // UPDATE INVENTORY
async update(
  id: string,
  data: any,
  tenantId: string,
  userEmail: string
){

  const existing =
    await this.prisma.inventory.findFirst({

      where: {

        id,

        tenantId,
      },
    });

  if (!existing) {

   throw new NotFoundException(
  "Inventory item not found"
);
  }

if (
  data.quantity !== undefined &&
  data.quantity < 0
) {

  throw new BadRequestException(
    "Quantity cannot be negative"
  );
}

if (
  data.price !== undefined &&
  data.price < 0
) {

  throw new BadRequestException(
    "Price cannot be negative"
  );
}

if (data.sku) {

  const duplicateSku =
    await this.prisma.inventory.findFirst({

      where: {

        tenantId,

        sku: data.sku,

        NOT: {
          id,
        },
      },
    });

  if (duplicateSku) {

    throw new BadRequestException(
      "SKU already exists"
    );
  }
}

  const item =
    await this.prisma.inventory.update({

      where: { id },

      data,
    });

  await this.notificationsService
    .create(

{
  title:
    "Inventory Updated",

  message:
    `${item.productName} inventory updated`,

  type:
    "INFO",
},

item.tenantId
);

  this.realtimeGateway
  .dashboardRefresh();

await this.auditService.createLog({

  action: "UPDATE",

  module: "INVENTORY",

  description:
    `Updated inventory item ${item.productName}`,

  userEmail,

  tenantId,
});

return item;
}
  // CREATE PURCHASE ORDER
 async createPurchaseOrder(
  data: any,
  tenantId: string,
  userEmail: string
){

    const po =
  await this.prisma.purchaseOrder.create({

    data: {
      vendorName:
        data.vendorName,

      productName:
        data.productName,

      quantity:
        Number(data.quantity),

      price:
        Number(data.price),

      tenantId,
    },
  });

await this.notificationsService
  .create(

{
  title:
    "Purchase Order Created",

  message:
    `${po.productName} purchase order created`,

  type:
    "INFO",
},

tenantId
);

await this.auditService.createLog({

  action: "PO_CREATED",

  module: "INVENTORY",

  description:
    `Purchase Order created for ${po.productName}`,

  userEmail,

  tenantId,
});

return po;
  }

  // GET PURCHASE ORDERS
  async getPurchaseOrders(
    tenantId: string
  ) {

    return this.prisma.purchaseOrder.findMany({

      where: {
        tenantId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

// COMPLETE PURCHASE ORDER
async completePurchaseOrder(
  id: string,
  tenantId: string,
  userEmail: string
) {

  // FIND ORDER
 const order =
  await this.prisma.purchaseOrder.findFirst({

    where: {
      id,
      tenantId,
    },
  });

  if (!order) {

    throw new NotFoundException(
  "Purchase order not found"
);
  }

  // PREVENT DUPLICATE COMPLETE
  if (order.status === "COMPLETED") {

    throw new BadRequestException(
  "Order already completed"
);
  }

  // FIND INVENTORY PRODUCT
  const existingInventory =
    await this.prisma.inventory.findFirst({

      where: {

        tenantId:
          order.tenantId,

        productName:
          order.productName,
      },
    });

  // PRODUCT MUST EXIST
  if (!existingInventory) {
throw new NotFoundException(
  "Inventory SKU not found"
);
  }

  // UPDATE INVENTORY STOCK
  await this.prisma.inventory.update({

    where: {
      id:
        existingInventory.id,
    },

    data: {

      quantity: {

        increment:
          order.quantity,
      },
    },
  });

  // UPDATE ORDER STATUS
  const completedOrder =
    await this.prisma.purchaseOrder.update({

      where: {
        id,
      },

      data: {
        status: "COMPLETED",
      },
    });

  // STOCK MOVEMENT
  await this.prisma.stockMovement.create({

    data: {

      type:
        "PURCHASE_RECEIVED",

      productName:
        order.productName,

      quantity:
        order.quantity,

      reference:
        order.id,

      tenantId:
        order.tenantId,
    },
  });

  await this.notificationsService
  .create(

{
  title:
    "Stock Replenished",

  message:
    `${order.productName} stock increased by ${order.quantity}`,

  type:
    "SUCCESS",
},

order.tenantId
);

this.realtimeGateway
  .inventoryUpdated({

    action:
      "PURCHASE_RECEIVED",

    product:
      order.productName,
  });

this.realtimeGateway
  .dashboardRefresh();

await this.auditService.createLog({

  action: "PO_COMPLETED",

  module: "INVENTORY",

  description:
    `${order.productName} purchase received`,

  userEmail,

  tenantId:
    order.tenantId,
});

return completedOrder;
}
// GET STOCK MOVEMENTS
async getStockMovements(
  tenantId: string
) {
  return this.prisma.stockMovement.findMany({

    where: {
      tenantId,
    },
 orderBy: {
      createdAt: "desc",
    },
  });
}
}