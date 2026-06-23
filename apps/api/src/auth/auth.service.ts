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
        !data?.password ||
        !data?.tenantName
      ) {
        throw new BadRequestException(
          "All fields are required"
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
      const tenant =
        await this.prisma.tenant.create({
          data: {
            name: data.tenantName,
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

      // CREATE USER
const user =
  await this.prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,

      // DEFAULT ROLE
              role:
        [
        "ADMIN",
        "MANAGER",
        "HR",
        "FINANCE",
        "SALES",
        "EMPLOYEE"
        ].includes(data.role)

        ? data.role

        : "ADMIN",

      tenantId: tenant.id,
    },
  });
      return {
        success: true,

        message:
          "User registered successfully",

        data: {

          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId,
          },

          tenant,
        },
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