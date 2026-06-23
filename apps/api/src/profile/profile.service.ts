import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";

import { PrismaService }
from "../prisma/prisma.service";

import * as bcrypt from "bcrypt";

@Injectable()
export class ProfileService {

  constructor(
    private prisma: PrismaService
  ) {}

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
        role: true,
        tenantId: true,
        name: true,
        phone: true,
        avatar: true,
      },
    });
  }
async updateProfile(
  userId: string,
  data: any
) {

  return this.prisma.user.update({

    where: {
      id: userId,
    },

    data,
  });
}
    

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

      throw new NotFoundException(
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
        "Old password incorrect"
      );
    }

    const hashed =
      await bcrypt.hash(
        data.newPassword,
        10
      );

    return this.prisma.user.update({

      where: {
        id: userId,
      },

      data: {
        password: hashed,
      },
    });
  }
}