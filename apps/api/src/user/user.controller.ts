import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Req,
  UseGuards,
} from "@nestjs/common";

import { UserService }
from "./user.service";

import { JwtAuthGuard }
from "../auth/jwt.guard";

import { RolesGuard }
from "../auth/roles.guard";

import { Roles }
from "../auth/roles.decorator";

@UseGuards(
  JwtAuthGuard,
  RolesGuard
)
@Controller("users")
export class UserController {

  constructor(
    private userService: UserService
  ) {}

  // GET USERS
  @Get()
  @Roles("ADMIN")
  getUsers(
    @Req() req: any
  ) {

    return this.userService.getAllUsers(
      req.user.tenantId
    );
  }

  // CREATE USER
  @Post()
  @Roles("ADMIN")
  createUser(
    @Body() body: any,
    @Req() req: any
  ) {

    return this.userService.createUser(
      body,
      req.user.tenantId
    );
  }

  // CHANGE ROLE
  @Put(":id/role")
  @Roles("ADMIN")
 updateRole(
  @Param("id") id: string,
  @Body() body: any,
  @Req() req: any
) {

   return this.userService.updateRole(
  id,
  body.role,
  req.user.tenantId
);
  }

@Put(":id/enable")
@Roles("ADMIN")
enableUser(
  @Param("id") id: string,
  @Req() req: any
) {
  return this.userService.enableUser(
    id,
    req.user.tenantId
  );
}

  // DISABLE USER
@Put(":id/disable")
@Roles("ADMIN")
disableUser(
  @Param("id") id: string,
  @Req() req: any
) {
  return this.userService.disableUser(
    id,
    req.user.tenantId
  );
}

// GET PROFILE
@Get("profile")
getProfile(
  @Req() req: any
) {

  return this.userService.getProfile(
    req.user.userId
  );
}

// UPDATE PROFILE
@Put("profile")
updateProfile(
  @Body() body: any,
  @Req() req: any
) {

  return this.userService.updateProfile(
    req.user.userId,
    body
  );
}

@Put("change-password")
changePassword(
  @Body() body: any,
  @Req() req: any
) {

  return this.userService.changePassword(
    req.user.userId,
    body
  );
}

}
