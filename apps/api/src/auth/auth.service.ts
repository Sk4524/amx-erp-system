import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

import { JwtService } from "@nestjs/jwt";

import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  // REGISTER
  async register(data: any) {

    try {

      if (
  !data?.email ||
  !data?.password
) {
  throw new BadRequestException(
    "Email and password are required"
  );
}

if (
  !data?.tenantName &&
  !data?.companyCode
) {
  throw new BadRequestException(
    "Either tenantName or companyCode is required."
  );
} 

            data.email =
      data.email
      .trim()
      .toLowerCase();


      const existingUser =
        await this.prisma.user.findUnique({
          where: {
  email:
    data.email
      .trim()
      .toLowerCase(),
},
        });

      if (existingUser) {
        throw new BadRequestException(
          "User already exists"
        );
      }

      const hashedPassword =
        await bcrypt.hash(data.password, 10);

      // CREATE TENANT
      let tenant;

if (data.tenantName) {

  // COMPANY REGISTRATION

  const companyCode =
    data.tenantName
      .replace(/[^A-Za-z]/g, "")
      .toUpperCase()
      .substring(0, 4) +
    Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();

  tenant =
    await this.prisma.tenant.create({

      data: {

        name: data.tenantName,

        companyCode,

        industry: data.industry || null,

        phone: data.phone || null,

        email: data.email,

        address: data.address || null,

      },

    });

  await this.prisma.account.create({

    data: {

      name: "Main Business Account",

      type: "BANK",

      balance: 0,

      tenantId: tenant.id,

    },

  });

} else {

  // EMPLOYEE REGISTRATION

  tenant =
    await this.prisma.tenant.findUnique({

      where: {

        companyCode:
          data.companyCode,

      },

    });

  if (!tenant) {

    throw new BadRequestException(
      "Invalid company code."
    );

  }

}

      // CREATE USER
// COMPANY REGISTRATION
if (data.tenantName) {

  const user = await this.prisma.user.create({

    data: {

      email: data.email,

      password: hashedPassword,

      role: "ADMIN",

      tenantId: tenant.id,

      companyCode: tenant.companyCode,

      name: data.name,

      phone: data.phone,

      isApproved: true,

      isActive: true,

    },

  });

  return {

    success: true,

    message: "Company registered successfully.",

    data: {

      companyCode: tenant.companyCode,

      user,

    },

  };

}

// EMPLOYEE REGISTRATION

await this.prisma.pendingEmployee.create({

  data: {

    name: data.name,

    email: data.email,

    password: hashedPassword,

    role: data.role,

    phone: data.phone,

    department: data.department,

    designation: data.designation,

    companyCode: data.companyCode,

    tenantId: tenant.id,

  },

});

return {

  success: true,

  message:

    "Registration submitted successfully. Please wait for HR/Admin approval.",

};

    } catch (error) {

      throw error;
    }
  }

  // LOGIN
  async login(data: any) {

    try {

      if (
        !data?.email ||
        !data?.password
      ) {
        throw new BadRequestException(
          "Email and password are required"
        );
      }

      const user =
        await this.prisma.user.findUnique({
          where: {
            email: data.email,
          },
        });

      if (!user) {
  throw new UnauthorizedException(
    "Invalid credentials"
  );
}
      if (!user.isActive) {
  throw new UnauthorizedException(
    "User account disabled"
  );
}
if (!user.isApproved) {
  throw new UnauthorizedException(
    "Your account is waiting for HR/Admin approval."
  );
}
      const isMatch =
        await bcrypt.compare(
          data.password,
          user.password
        );

      if (!isMatch) {
        throw new UnauthorizedException(
  "Invalid credentials"
);
      }
    
await this.prisma.user.update({

  where: {
    id: user.id,
  },

  data: {
    lastLogin: new Date(),
  },
});

const employee =
  await this.prisma.employee.findFirst({

    where: {

      userId: user.id,

    },

    select: {

      id: true,

    },

  });

     const token =
  this.jwtService.sign({
    userId: user.id,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId,
  });

      return {

        success: true,

        data: {

          access_token: token,

         user: {

          id: user.id,

          employeeId: employee?.id || null,

          name: user.name,

          email: user.email,

          role: user.role,

          tenantId: user.tenantId,

        },
        },
      };

    } catch (error) {

      throw error;
    }
  }
}