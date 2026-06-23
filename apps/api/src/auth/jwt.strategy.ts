import {
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { PrismaService }
from "../prisma/prisma.service";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
  private prisma: PrismaService
) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:process.env.JWT_SECRET ||"amx-erp-enterprise-secret"
    });
  }

async validate(payload: any) {

  const user =
    await this.prisma.user.findUnique({

      where: {
        id: payload.userId,
      },
    });

  if (!user) {

    throw new UnauthorizedException(
      "User not found"
    );
  }

  if (!user.isActive) {

    throw new UnauthorizedException(
      "Account disabled"
    );
  }

  return {

  id: user.id,

  userId: user.id,

  email: user.email,

  role: user.role,

  tenantId: user.tenantId,

  isActive: user.isActive,
};
}
}