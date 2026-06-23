import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService }
from "../prisma/prisma.service";
import { AuditService }
from "../audit/audit.service";

import { NotificationsService }
from "../notifications/notifications.service";

@Injectable()
export class HrService {

constructor(
  private prisma: PrismaService,
  private auditService: AuditService,
  private notificationsService: NotificationsService,
) {}

  // GET ATTENDANCE
  async getAttendance(
    tenantId: string
  ) {

    return this.prisma.attendance.findMany({

      where: {
        tenantId,
      },

      include: {
        employee: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // CREATE ATTENDANCE
async createAttendance(
  data: any,
  tenantId: string
) {

  const attendance =
    await this.prisma.attendance.create({

      data: {

        employeeId:
          data.employeeId,

        date:
          new Date(data.date),

        status:
          data.status,

        tenantId,
      },
    });

  await this.auditService.createLog({

    action:
      "ATTENDANCE_CREATED",

    module:
      "HR",

    description:
      `Attendance marked for employee ${attendance.employeeId}`,

    userEmail:
      "SYSTEM",

    tenantId,
  });

  return attendance;
}

  // GET LEAVES
  async getLeaves(
    tenantId: string
  ) {

    return this.prisma.leave.findMany({

      where: {
        tenantId,
      },

      include: {
        employee: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // CREATE LEAVE
 async createLeave(
  data: any,
  tenantId: string
) {

  const leave =
    await this.prisma.leave.create({

      data: {

        employeeId:
          data.employeeId,

        reason:
          data.reason,

        startDate:
          new Date(data.startDate),

        endDate:
          new Date(data.endDate),

        tenantId,
      },
    });

  await this.auditService.createLog({

    action:
      "LEAVE_CREATED",

    module:
      "HR",

    description:
      `Leave requested by employee ${leave.employeeId}`,

    userEmail:
      "SYSTEM",

    tenantId,
  });

  return leave;
}
  // APPROVE LEAVE
 async approveLeave(
  id: string
) {

  const leave =
    await this.prisma.leave.findUnique({

      where: { id },
    });

  if (!leave) {

    throw new NotFoundException(
      "Leave request not found"
    );
  }

  const updatedLeave =
    await this.prisma.leave.update({

      where: {
        id,
      },

      data: {
        status: "APPROVED",
      },
    });

 await this.auditService.createLog({

  action:
    "LEAVE_APPROVED",

  module:
    "HR",

  description:
    `Leave approved for employee ${updatedLeave.employeeId}`,

  userEmail:
    "SYSTEM",

  tenantId:
    updatedLeave.tenantId,
});

await this.notificationsService.create(

  {

    title:
      "Leave Approved",

    message:
      `Leave approved for employee ${updatedLeave.employeeId}`,

    type:
      "LEAVE_APPROVED",
  },

  updatedLeave.tenantId
);

return updatedLeave;
}

  // REJECT LEAVE
 async rejectLeave(
  id: string
) {

  const leave =
    await this.prisma.leave.findUnique({

      where: { id },
    });

  if (!leave) {

    throw new NotFoundException(
      "Leave request not found"
    );
  }

  const updatedLeave =
    await this.prisma.leave.update({

      where: {
        id,
      },

      data: {
        status: "REJECTED",
      },
    });
await this.auditService.createLog({

  action:
    "LEAVE_REJECTED",

  module:
    "HR",

  description:
    `Leave rejected for employee ${updatedLeave.employeeId}`,

  userEmail:
    "SYSTEM",

  tenantId:
    updatedLeave.tenantId,
});

await this.notificationsService.create(

  {

    title:
      "Leave Rejected",

    message:
      `Leave rejected for employee ${updatedLeave.employeeId}`,

    type:
      "LEAVE_REJECTED",
  },

  updatedLeave.tenantId
);

return updatedLeave;
}
}