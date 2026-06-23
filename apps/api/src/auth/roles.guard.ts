import {
  Injectable,
  CanActivate,
  ExecutionContext
} from "@nestjs/common";

import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(
    private reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean {

    const roles =
  this.reflector.getAllAndOverride<string[]>(
    "roles",
    [
      context.getHandler(),
      context.getClass(),
    ]
  );

    if (!roles) {
      return true;
    }

    const request =
      context.switchToHttp().getRequest();

    const user = request.user;
    if (!user) {
      return false;
    }

    // Normalize user's roles to an array of strings
    const userRoles: string[] = Array.isArray(user?.roles)
      ? user.roles
      : user?.role
      ? [user.role]
      : [];

    if (userRoles.length === 0) {
      return false;
    }

    // Allow if user has at least one required role
    return roles.some((role) => userRoles.includes(role));
  }
}