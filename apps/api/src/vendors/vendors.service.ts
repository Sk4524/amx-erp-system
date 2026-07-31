import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { AuditService }
from "../audit/audit.service";

import { PrismaService }
from "../prisma/prisma.service";


@Injectable()
export class VendorsService {



constructor(
  private prisma:
  PrismaService,

  private auditService:
  AuditService,

) {}

  // GET
async getVendors(
  tenantId: string,
  search = "",
) {

  const vendors =
    await this.prisma.vendor.findMany({

      where: {

        tenantId,

        OR: [

          {

            name: {

              contains: search,

              mode: "insensitive",

            },

          },

          {

            company: {

              contains: search,

              mode: "insensitive",

            },

          },

          {

            email: {

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

    data: vendors,

  };

}

  // CREATE
 async createVendor(
  data: any,
  tenantId: string,
  userEmail: string
){

  const vendor =
    await this.prisma.vendor.create({

      data: {
        ...data,
        tenantId,
      },
    });

  await this.auditService.createLog({

    action:
      "VENDOR_CREATED",

    module:
      "VENDOR",

    description:
      `Created vendor ${vendor.name}`,

    userEmail,
      

    tenantId,
  });
await this.prisma.notification.create({

  data: {

    title:
      "Vendor Created",

    message:
      `${vendor.name} has been added`,

    type:
      "VENDOR",

    tenantId,
  },
});
  return vendor;
}

async updateVendor(
  id: string,
  data: any,
  tenantId: string,
  userEmail: string
) {

  const vendor =
    await this.prisma.vendor.findFirst({

      where: {
        id,
        tenantId,
      },
    });

  if (!vendor) {

    throw new NotFoundException(
      "Vendor not found"
    );
  }

  const updatedVendor =
    await this.prisma.vendor.update({

      where: {
        id,
      },

      data,
    });

  await this.auditService.createLog({

    action:
      "VENDOR_UPDATED",

    module:
      "VENDOR",

    description:
      `Updated vendor ${updatedVendor.name}`,

    userEmail,
      

    tenantId,
  });

  return updatedVendor;
}

  // DELETE
async deleteVendor(
  id: string,
  tenantId: string,
  userEmail: string
) {

  const vendor =
    await this.prisma.vendor.findFirst({

      where: {

        id,

        tenantId,
      },
    });

  if (!vendor) {

    throw new NotFoundException(
      "Vendor not found"
    );
  }

  const deletedVendor =
    await this.prisma.vendor.delete({

      where: {
        id,
      },
    });

  await this.auditService.createLog({

    action:
      "VENDOR_DELETED",

    module:
      "VENDOR",

    description:
      `Deleted vendor ${vendor.name}`,

    userEmail,
      

    tenantId,
  });
await this.prisma.notification.create({

  data: {

    title:
      "Vendor Deleted",

    message:
      `${vendor.name} has been removed`,

    type:
      "VENDOR",

    tenantId,
  },
});
  return deletedVendor;
}

async getVendorSummary(
  tenantId: string,
) {

  const [
    totalVendors,
    activeVendors,
    inactiveVendors,
    newThisMonth,
  ] = await Promise.all([

    this.prisma.vendor.count({

      where: {
        tenantId,
      },

    }),

    this.prisma.vendor.count({

      where: {

        tenantId,

        status: "ACTIVE",

      },

    }),

    this.prisma.vendor.count({

      where: {

        tenantId,

        status: "INACTIVE",

      },

    }),

    this.prisma.vendor.count({

      where: {

        tenantId,

        createdAt: {

          gte: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1,
          ),

        },

      },

    }),

  ]);

  return {

    success: true,

    data: {

      totalVendors,

      activeVendors,

      inactiveVendors,

      newThisMonth,

    },

  };

}

async getVendorById(
  id: string,
  tenantId: string,
) {

  const vendor =
    await this.prisma.vendor.findFirst({

      where: {

        id,

        tenantId,

      },

    });

  if (!vendor) {

    throw new NotFoundException(
      "Vendor not found",
    );

  }

  return {

    success: true,

    data: vendor,

  };

}

async getVendorAnalytics(
  tenantId: string,
) {

  const [
    active,
    inactive,
  ] = await Promise.all([

    this.prisma.vendor.count({

      where: {

        tenantId,

        status: "ACTIVE",

      },

    }),

    this.prisma.vendor.count({

      where: {

        tenantId,

        status: "INACTIVE",

      },

    }),

  ]);

  return {

    success: true,

    data: {

      active,

      inactive,

    },

  };

}

async getMonthlyVendorAnalytics(
  tenantId: string,
) {

  const vendors =
    await this.prisma.vendor.findMany({

      where: {
        tenantId,
      },

      select: {
        createdAt: true,
      },

      orderBy: {
        createdAt: "asc",
      },

    });

  const monthly: Record<
    string,
    number
  > = {};

  for (const vendor of vendors) {

    const month =
      vendor.createdAt.toLocaleString(
        "en-US",
        {
          month: "short",
          year: "numeric",
        },
      );

    monthly[month] =
      (monthly[month] || 0) + 1;

  }

  return {

    success: true,

    data: Object.entries(monthly).map(

      ([month, total]) => ({

        month,

        vendors: total,

      }),

    ),

  };

}

}