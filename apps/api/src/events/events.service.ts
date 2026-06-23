import { Injectable }
from "@nestjs/common";

import {
  OnEvent
} from "@nestjs/event-emitter";

import { PrismaService }
from "../prisma/prisma.service";

import { RealtimeGateway }
from "../realtime/realtime.gateway";

@Injectable()
export class EventsService {

  constructor(

    private prisma:
    PrismaService,

    private realtimeGateway:
    RealtimeGateway

  ) {}

  // LOW STOCK EVENT
  @OnEvent("inventory.low_stock")
  async handleLowStock(
    payload: any
  ) {

    await this.prisma.notification.create({

      data: {

        title:
          "Low Stock Alert",

        message:
          `${payload.productName} inventory is critically low.`,

        type:
          "INVENTORY",

        tenantId:
          payload.tenantId,
      },
    });

    // REALTIME SOCKET EVENT
    this.realtimeGateway.sendNotification({

      title:
        "Low Stock Alert",

      message:
        `${payload.productName} inventory is critically low.`,
    });
  }

  // LEAVE EVENT
  @OnEvent("leave.requested")
  async handleLeaveRequest(
    payload: any
  ) {

    await this.prisma.notification.create({

      data: {

        title:
          "Leave Request",

        message:
          `${payload.employeeName} applied for leave.`,

        type:
          "HR",

        tenantId:
          payload.tenantId,
      },
    });

    // REALTIME SOCKET EVENT
    this.realtimeGateway.sendNotification({

      title:
        "Leave Request",

      message:
        `${payload.employeeName} applied for leave.`,
    });
  }

  // SALES EVENT
  @OnEvent("sales.created")
  async handleSalesCreated(
    payload: any
  ) {

    await this.prisma.notification.create({

      data: {

        title:
          "New Sales Order",

        message:
          `Sales order created for ${payload.customer}.`,

        type:
          "SALES",

        tenantId:
          payload.tenantId,
      },
    });

    // REALTIME SOCKET EVENT
    this.realtimeGateway.sendNotification({

      title:
        "New Sales Order",

      message:
        `Sales order created for ${payload.customer}.`,
    });
  }
}