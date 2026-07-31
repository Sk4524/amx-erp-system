import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";

import { PrismaService }
from "../prisma/prisma.service";
import { AuditService }
from "../audit/audit.service";
import * as ExcelJS from "exceljs";
import { Response } from "express";
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
  tenantId: string,
  filters?: {
    employeeId?: string;
    status?: string;
    from?: string;
    to?: string;
  },
) {

  const where: any = {
    tenantId,
  };

  if (filters?.employeeId) {

    where.employeeId =
      filters.employeeId;

  }

  if (filters?.status) {

    where.status =
      filters.status;

  }

  if (
    filters?.from ||
    filters?.to
  ) {

    where.date = {};

    if (filters.from) {

      where.date.gte =
        new Date(filters.from);

    }

    if (filters.to) {

      const end =
        new Date(filters.to);

      end.setHours(
        23,
        59,
        59,
        999,
      );

      where.date.lte =
        end;

    }

  }

  return this.prisma.attendance.findMany({

    where,

    include: {

      employee: true,

    },

    orderBy: {

      date: "desc",

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

async getPendingLeaves(
  tenantId: string,
) {

  const leaves =
    await this.prisma.leave.findMany({

      where: {

        tenantId,

        status: "PENDING",

      },

      include: {

        employee: true,

      },

      orderBy: {

        createdAt: "desc",

      },

    });

  return {

    success: true,

    data: leaves,

  };

}

  // CREATE LEAVE
async createLeave(
  data: any,
  userId: string,
  tenantId: string,
) {

// Find employee from logged-in user

const employee =
  await this.prisma.employee.findUnique({

    where: {
      userId,
    },

  });

if (!employee) {

  throw new NotFoundException(
    "Employee profile not found",
  );

}

// Create leave request

const leave =
  await this.prisma.leave.create({

    data: {

      employeeId: employee.id,

      reason: data.reason,

      startDate: new Date(data.startDate),

      endDate: new Date(data.endDate),

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


async getMyLeaves(
  userId: string,
) {

  const employee =
    await this.prisma.employee.findUnique({

      where: {
        userId,
      },

    });

  if (!employee) {

    throw new NotFoundException(
      "Employee profile not found",
    );

  }

  const leaves =
    await this.prisma.leave.findMany({

      where: {
        employeeId: employee.id,
      },

      orderBy: {
        createdAt: "desc",
      },

    });

  return {

    success: true,

    data: leaves,

  };

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
if (leave.status !== "PENDING") {

  throw new BadRequestException(
    "Only pending leave requests can be approved.",
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
if (leave.status !== "PENDING") {

  throw new BadRequestException(
    "Only pending leave requests can be rejected.",
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

async checkIn(
  employeeId: string,
  tenantId: string,
) {

  const employee =
    await this.prisma.employee.findFirst({

      where: {
        id: employeeId,
        tenantId,
      },

    });

  if (!employee) {

    throw new NotFoundException(
      "Employee not found",
    );

  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const existing =
    await this.prisma.attendance.findFirst({

      where: {

        employeeId,

        date: today,

      },

    });

  if (existing) {

    throw new BadRequestException(
      "Already checked in today.",
    );

  }

 const now = new Date();

const officeStart = new Date(today);
officeStart.setHours(9, 0, 0, 0);

let status = "PRESENT";

if (now > officeStart) {
  status = "LATE";
}

const attendance =
  await this.prisma.attendance.create({

    data: {

      employeeId,

      tenantId,

      date: today,

      checkIn: now,

      status,

    },

  });

  return {

    success: true,

    message: "Check-In successful.",

    data: attendance,

  };

}

async checkOut(
  employeeId: string,
  tenantId: string,
) {

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const attendance =
    await this.prisma.attendance.findFirst({

      where: {

        employeeId,

        tenantId,

        date: today,

      },

    });

  if (!attendance) {

    throw new NotFoundException(
      "Check-In not found for today.",
    );

  }

  if (attendance.checkOut) {

    throw new BadRequestException(
      "Already checked out today.",
    );

  }

  const now = new Date();

  const hours =
    Number(
      (
        (now.getTime() -
          attendance.checkIn!.getTime()) /
        1000 /
        60 /
        60
      ).toFixed(2),
    );
let status = attendance.status;

if (hours < 4) {
  status = "HALF_DAY";
}
  const updated =
    await this.prisma.attendance.update({

      where: {
        id: attendance.id,
      },

      data: {

        checkOut: now,

        workingHours: hours,

        status,

      },

    });

  return {

    success: true,

    message: "Check-Out successful.",

    data: updated,

  };

}

async getMyAttendance(
  userId: string,
  tenantId: string,
) {

  const employee =
    await this.prisma.employee.findFirst({

      where: {

        userId,

        tenantId,

      },

    });

  if (!employee) {

    throw new NotFoundException(
      "Employee not found",
    );

  }

  const attendance =
    await this.prisma.attendance.findMany({

      where: {

        employeeId: employee.id,

      },

      orderBy: {

        date: "desc",

      },

    });

  return {

    success: true,

    data: attendance,

  };

}

async getDashboard(
  tenantId: string,
) {

  const [
    employees,
    attendance,
    leaves,
  ] = await Promise.all([

    this.prisma.employee.count({
      where: {
        tenantId,
      },
    }),

    this.prisma.attendance.findMany({
      where: {
        tenantId,
      },
    }),

    this.prisma.leave.findMany({
      where: {
        tenantId,
      },
    }),

  ]);

  return {

    success: true,

    data: {

      totalEmployees: employees,

      present: attendance.filter(
        a => a.status === "PRESENT"
      ).length,

      absent: attendance.filter(
        a => a.status === "ABSENT"
      ).length,

      late: attendance.filter(
        a => a.status === "LATE"
      ).length,

      halfDay: attendance.filter(
        a => a.status === "HALF_DAY"
      ).length,

      pendingLeaves: leaves.filter(
        l => l.status === "PENDING"
      ).length,

      approvedLeaves: leaves.filter(
        l => l.status === "APPROVED"
      ).length,

      rejectedLeaves: leaves.filter(
        l => l.status === "REJECTED"
      ).length,

    },

  };

}

async getAttendanceTrend(
    tenantId: string,
) {

    const today = new Date();

    const data = [];

    for (let i = 6; i >= 0; i--) {

        const day = new Date(today);

        day.setDate(today.getDate() - i);

        const nextDay = new Date(day);

        nextDay.setDate(day.getDate() + 1);

      const present =
    await this.prisma.attendance.count({
        where: {
            tenantId,
            status: "PRESENT",
            date: {
                gte: day,
                lt: nextDay,
            },
        },
    });

        data.push({
            label: day.toLocaleDateString("en-US", {
                weekday: "short",
            }),
            present,
        });
    }

    return {
        success: true,
        data,
    };
}

async exportAttendance(
  tenantId: string,
  res: Response,
  filters?: {
    employeeId?: string;
    status?: string;
    from?: string;
    to?: string;
  },
) {

  const where: any = {
  tenantId,
};

if (filters?.employeeId) {
  where.employeeId = filters.employeeId;
}

if (filters?.status) {
  where.status = filters.status;
}

if (filters?.from || filters?.to) {

  where.date = {};

  if (filters.from) {
    where.date.gte = new Date(filters.from);
  }

  if (filters.to) {
    const end = new Date(filters.to);
    end.setHours(23, 59, 59, 999);
    where.date.lte = end;
  }

}

const attendance =
  await this.prisma.attendance.findMany({

    where,

    include: {
      employee: true,
    },

    orderBy: {
      date: "desc",
    },

  });

  const workbook =
    new ExcelJS.Workbook();

  const sheet =
    workbook.addWorksheet("Attendance");

  sheet.columns = [

    {
      header: "Employee",
      key: "employee",
      width: 30,
    },

    {
      header: "Date",
      key: "date",
      width: 18,
    },

    {
      header: "Status",
      key: "status",
      width: 18,
    },

    {
      header: "Check In",
      key: "checkIn",
      width: 20,
    },

    {
      header: "Check Out",
      key: "checkOut",
      width: 20,
    },

    {
      header: "Working Hours",
      key: "workingHours",
      width: 18,
    },

  ];

  attendance.forEach((item: any) => {

    sheet.addRow({

      employee:
        item.employee?.name ?? "-",

      date:
        item.date
          ?.toLocaleDateString(),

      status:
        item.status,

      checkIn:
        item.checkIn
          ? item.checkIn.toLocaleTimeString()
          : "-",

      checkOut:
        item.checkOut
          ? item.checkOut.toLocaleTimeString()
          : "-",

      workingHours:
        item.workingHours ?? "-",

    });

  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );

  res.setHeader(
    "Content-Disposition",
    'attachment; filename="attendance.xlsx"',
  );

  await workbook.xlsx.write(res);

  res.end();

}

}