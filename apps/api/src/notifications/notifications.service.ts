import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AuditService }
from "../audit/audit.service";

import { PrismaService }
from "../prisma/prisma.service";

import { RealtimeGateway }
from "../realtime/realtime.gateway";

@Injectable()
export class NotificationsService {

constructor(
  private prisma: PrismaService,
  private auditService: AuditService,
  private realtimeGateway: RealtimeGateway,
) {}

  // GET ALL
  async getAll(
    tenantId: string
  ) {

    return this.prisma.notification.findMany({

      where: {
        tenantId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // CREATE
 async create(
  data: any,
  tenantId: string
) {

  const notification =
    await this.prisma.notification.create({

      data: {
        ...data,
        tenantId,
      },
    });

this.realtimeGateway
  .sendNotification({

    id:
      notification.id,

    title:
      notification.title,

    message:
      notification.message,

    type:
      notification.type,

    isRead:
      false,

    createdAt:
      notification.createdAt,
  });

  await this.auditService.createLog({

    action:
      "NOTIFICATION_CREATED",

    module:
      "NOTIFICATIONS",

    description:
      `Notification created: ${notification.title}`,

    userEmail:
      "SYSTEM",

    tenantId,
  });

  return notification;
}
  // CREATE NOTIFICATION

  // DELETE
 async deleteNotification(
  id: string,
  tenantId: string
) {

  const notification =
    await this.prisma.notification.findFirst({

      where: {
        id,
        tenantId,
      },
    });

  if (!notification) {

    throw new NotFoundException(
      "Notification not found"
    );
  }

  await this.auditService.createLog({

    action:
      "NOTIFICATION_DELETED",

    module:
      "NOTIFICATIONS",

    description:
      `Notification deleted: ${notification.title}`,

    userEmail:
      "SYSTEM",

    tenantId,
  });

  return this.prisma.notification.delete({

    where: {
      id,
    },
  });
}
  // MARK AS READ
 async markAsRead(
  id: string,
  tenantId: string
) {

  const notification =
    await this.prisma.notification.findFirst({

      where: {
        id,
        tenantId,
      },
    });

  if (!notification) {

    throw new NotFoundException(
      "Notification not found"
    );
  }

  await this.auditService.createLog({

  action:
    "NOTIFICATION_READ",

  module:
    "NOTIFICATIONS",

  description:
    `Notification read: ${notification.title}`,

  userEmail:
    "SYSTEM",

  tenantId,
});
  return this.prisma.notification.update({

    where: {
      id,
    },

    data: {
      isRead: true,
    },
  });
}
}