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

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";

@Injectable()
export class UserService {

  constructor(
  private prisma: PrismaService
) {}

  // GET USERS
async getAllUsers(
  tenantId: string
) {

  const users =
    await this.prisma.user.findMany({

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

  return {

    success: true,

    data: users,

  };

}

// GET PENDING USERS
async getPendingUsers(tenantId: string,) {
  console.log("Tenant from JWT:", tenantId);
  const users = await this.prisma.pendingEmployee.findMany({
  where: {
    tenantId,
    status: "PENDING",
  },
  orderBy: {
    createdAt: "desc",
  },
  select: {
    id: true,
    name: true,
    email: true,
    role: true,
    companyCode: true,
    department: true,
    designation: true,
    createdAt: true,
  },
});

return {
  success: true,
  data: users,
};
}

// APPROVE USER
async approveUser(
  id: string,
  tenantId: string,
) {
  const pending =
  await this.prisma.pendingEmployee.findFirst({

    where: {
      id,
      tenantId,
    },

  });

if (!pending) {

  throw new BadRequestException(
    "Pending employee not found"
  );

}

// Create User

const user = await this.prisma.user.create({

  data: {

    email: pending.email,

    password: pending.password,

    role: pending.role,

    name: pending.name,

    phone: pending.phone,

    companyCode: pending.companyCode,

    tenantId,

    isApproved: true,

    isActive: true,

  },

});

// Generate Employee Code

const employeeCount =
  await this.prisma.employee.count({

    where: {
      tenantId,
    },

  });

const employeeCode =
  `EMP${String(employeeCount + 1).padStart(6, "0")}`;

// Create Employee Profile

await this.prisma.employee.create({

  data: {

    userId: user.id,

    employeeCode,

    name: pending.name,

    email: pending.email,

    phone: pending.phone,

    department: pending.department,

    designation: pending.designation,

    joiningDate: new Date(),

    salary: 0,

    tenantId,

  },

});

// Delete Pending Request

await this.prisma.pendingEmployee.delete({

  where: {
    id: pending.id,
  },

});

  await this.prisma.auditLog.create({
    data: {
      action: "USER_APPROVED",
      module: "HR",
      description: `${user.email} approved`,
userEmail: user.email,
      
      tenantId,
    },
  });

  return {
    success: true,
    message: "Employee approved successfully.",
  };
}

// REJECT USER
async rejectUser(
  id: string,
  tenantId: string,
) {
  const pending =
  await this.prisma.pendingEmployee.findFirst({

    where: {
      id,
      tenantId,
    },

  });

if (!pending) {

  throw new BadRequestException(
    "Pending employee not found"
  );

}

  await this.prisma.auditLog.create({
    data: {
      action: "USER_REJECTED",
      module: "HR",
     description: `${pending.email} rejected`,
      userEmail: pending.email,
      tenantId,
    },
  });

 await this.prisma.pendingEmployee.delete({
    where: {
      id,
    },
  });

  return {
    success: true,
    message: "Employee registration rejected.",
  };
}

  // CREATE USER
 async createUser(
  data: CreateUserDto,
  tenantId: string
) {
data.email = data.email
  .trim()
  .toLowerCase();
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
  data.password.length < 8
) {
  throw new BadRequestException(
    "Password must be at least 8 characters"
  );
}  

data.email =
data.email
.trim()
.toLowerCase();
    const existing =
      await this.prisma.user.findUnique({

        where: {

  email:
    data.email
      .trim()
      .toLowerCase(),

}
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

  password: hashedPassword,

  role: data.role as Role,

  tenantId,

  name: null,

  phone: null,

  companyCode: null,

  isApproved: true,

  isActive: true,

}
      });
const employeeCode =
  `EMP${Date.now()}`;

await this.prisma.employee.create({

  data: {

    userId: user.id,

    employeeCode,

    name: user.name || user.email,

    email: user.email,

    joiningDate: new Date(),

    salary: 0,

    tenantId,

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

    return {

 success:true,

 message:"User created",

 data:user

};
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
      tenantId:true,
      isActive: true,
      lastLogin: true,
      createdAt: true,
    },
  });
}

// UPDATE PROFILE
async updateProfile(
  userId: string,
  data: UpdateProfileDto
) {

  return this.prisma.user.update({

    where: {
      id: userId,
    },

    data: {

 name:data.name?.trim(),

 phone:data.phone?.trim(),

}
  });
}

// CHANGE PASSWORD
async changePassword(
  userId: string,
  data: ChangePasswordDto
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

      data.oldPassword,

      user.password
    );

  if (!isMatch) {

    throw new BadRequestException(
      "Current password is incorrect"
    );
  }

  if (
    !data.newPassword ||
    data.newPassword.length < 8
  ) {

    throw new BadRequestException(
      "New password must be at least 8 characters"
    );
  }

  if (
 data.oldPassword ===
 data.newPassword
){

 throw new BadRequestException(
   "New password must be different"
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
