import {
  Injectable,
  BadRequestException,
} from "@nestjs/common";

import { Role }
from "@prisma/client";

import { PrismaService }
from "../prisma/prisma.service";


import * as bcrypt
from "bcrypt";

@Injectable()
export class UserService {

  constructor(
  private prisma: PrismaService
) {}

  // GET USERS
  async getAllUsers(
    tenantId: string
  ) {

    return this.prisma.user.findMany({

      where: {
        tenantId,
      },

      select: {
  id: true,
  email: true,
  name: true,
  phone: true,
  role: true,
  isActive: true,
  lastLogin: true,
  createdAt: true,
},

    });
  }

  // CREATE USER
  async createUser(
    data: any,
    tenantId: string
  ) {

if (
  !data.email ||
  !data.password ||
  !data.role
) {
  throw new BadRequestException(
    "All fields required"
  );
}

if (
  data.password.length < 6
) {
  throw new BadRequestException(
    "Password must be at least 6 characters"
  );
}  
    const existing =
      await this.prisma.user.findUnique({

        where: {
          email: data.email,
        },
      });

    if (existing) {

      throw new BadRequestException(
        "User already exists"
      );
    }

  const allowedRoles: Role[] = [

  "ADMIN",
  "MANAGER",
  "HR",
  "FINANCE",
  "SALES",
  "EMPLOYEE",
];

if (
  !allowedRoles.includes(
    data.role
  )
) {

  throw new BadRequestException(
    "Invalid role"
  );
}

    const hashedPassword =
      await bcrypt.hash(
        data.password,
        10
      );

    const user =
      await this.prisma.user.create({

        data: {

          email: data.email,

          password:
            hashedPassword,

          role:
            data.role as Role,

          tenantId,

          isActive: true,
        },
      });

    // AUDIT LOG
   await this.prisma.auditLog.create({

  data: {

    action:
      "USER_CREATED",

    module:
      "USER_MANAGEMENT",

    description:
      `Created user ${user.email} with role ${user.role}`,

    userEmail:
      user.email,

    tenantId,
  },
});

    return user;
  }

  // UPDATE ROLE
 async updateRole(
  id: string,
  role: Role,
  tenantId: string
) {

 const user =
  await this.prisma.user.findFirst({

    where: {
      id,
      tenantId,
    },
  });

  const allowedRoles: Role[] = [

  "ADMIN",
  "MANAGER",
  "HR",
  "FINANCE",
  "SALES",
  "EMPLOYEE",
];

if (
  !allowedRoles.includes(role)
) {

  throw new BadRequestException(
    "Invalid role"
  );
}

    if (!user) {

      throw new BadRequestException(
        "User not found"
      );
    }

    const oldRole =
      user.role;

    // PREVENT LAST ADMIN REMOVAL
    if (
      user.role === "ADMIN" &&
      role !== "ADMIN"
    ) {

      const adminCount =
        await this.prisma.user.count({

          where: {

            role: "ADMIN",

            tenantId:
              user.tenantId,

            isActive: true,
          },
        });

      if (adminCount <= 1) {

        throw new BadRequestException(
          "Cannot remove last admin"
        );
      }
    }

    const updatedUser =
      await this.prisma.user.update({

        where: {
          id,
        },

        data: {
          role,
        },
      });

    // AUDIT LOG
    await this.prisma.auditLog.create({

  data: {

    action:
      "ROLE_CHANGED",

    module:
      "USER_MANAGEMENT",

    description:
      `${updatedUser.email}: ${oldRole} → ${role}`,

    userEmail:
      updatedUser.email,

    tenantId:
      updatedUser.tenantId,
  },
});

    return updatedUser;
  }

  // ENABLE USER
async enableUser(
  id: string,
  tenantId: string
) {

 const user =
  await this.prisma.user.findFirst({

    where: {
      id,
      tenantId,
    },
  });

if (!user) {

  throw new BadRequestException(
    "User not found"
  );
}

const enabledUser =
  await this.prisma.user.update({

    where: {
      id,
    },

    data: {
      isActive: true,
    },
  });
  await this.prisma.auditLog.create({

    data: {

      action:
        "USER_ENABLED",

      module:
        "USER_MANAGEMENT",

      description:
        `${enabledUser.email} enabled`,

      userEmail:
        enabledUser.email,

      tenantId:
        enabledUser.tenantId,
    },
  });

  return enabledUser;
}
  // DISABLE USER
 async disableUser(
  id: string,
  tenantId: string
){

  const user =
  await this.prisma.user.findFirst({

    where: {
      id,
      tenantId,
    },
  });

  if (!user) {

    throw new BadRequestException(
      "User not found"
    );
  }

  // PREVENT LAST ADMIN DISABLE
  if (
    user.role === "ADMIN"
  ) {

    const adminCount =
      await this.prisma.user.count({

        where: {

          role: "ADMIN",

          tenantId:
            user.tenantId,

          isActive: true,
        },
      });

    if (adminCount <= 1) {

      throw new BadRequestException(
        "Cannot disable last admin"
      );
    }
  }

  const disabledUser =
    await this.prisma.user.update({

      where: {
        id,
      },

      data: {
        isActive: false,
      },
    });

  await this.prisma.auditLog.create({

    data: {

      action:
        "USER_DISABLED",

      module:
        "USER_MANAGEMENT",

      description:
        `${disabledUser.email} disabled`,

      userEmail:
        disabledUser.email,

      tenantId:
        disabledUser.tenantId,
    },
  });


  return disabledUser;

  
}
// GET PROFILE
async getProfile(
  userId: string
) {

  return this.prisma.user.findUnique({

    where: {
      id: userId,
    },

    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      isActive: true,
      lastLogin: true,
      createdAt: true,
    },
  });
}

// UPDATE PROFILE
async updateProfile(
  userId: string,
  data: any
) {

  return this.prisma.user.update({

    where: {
      id: userId,
    },

    data: {
      name: data.name,
      phone: data.phone,
    },
  });
}

// CHANGE PASSWORD
async changePassword(
  userId: string,
  data: any
) {

  const user =
    await this.prisma.user.findUnique({

      where: {
        id: userId,
      },
    });

  if (!user) {

    throw new BadRequestException(
      "User not found"
    );
  }

  const isMatch =
    await bcrypt.compare(

      data.currentPassword,

      user.password
    );

  if (!isMatch) {

    throw new BadRequestException(
      "Current password is incorrect"
    );
  }

  if (
    !data.newPassword ||
    data.newPassword.length < 6
  ) {

    throw new BadRequestException(
      "New password must be at least 6 characters"
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      data.newPassword,
      10
    );

  await this.prisma.user.update({

    where: {
      id: userId,
    },

    data: {
      password: hashedPassword,
    },
  });

  await this.prisma.auditLog.create({

    data: {

      action:
        "PASSWORD_CHANGED",

      module:
        "USER_MANAGEMENT",

      description:
        "User changed password",

      userEmail:
        user.email,

      tenantId:
        user.tenantId,
    },
  });

  return {
    success: true,
    message: "Password updated"
  };
}

}
