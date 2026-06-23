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
    tenantId: string
  ) {

    return this.prisma.vendor.findMany({

      where: {
        tenantId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
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
}