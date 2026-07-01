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

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import { UserService }
from "./user.service";

import { JwtAuthGuard }
from "../auth/jwt.guard";

import { RolesGuard }
from "../auth/roles.guard";

import { Roles }
from "../auth/roles.decorator";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";

@UseGuards(
  JwtAuthGuard,
  RolesGuard
)
@ApiTags("Users")
@ApiBearerAuth()
@Controller("users")
export class UserController {

  constructor(
    private userService: UserService
  ) {}

  // GET USERS
  @ApiOperation({
  summary: "Get all users"
})
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
  @ApiOperation({
  summary: "Create user"
})
@Post()
@Roles("ADMIN")
createUser(
  @Body() body: CreateUserDto,
  @Req() req: any
) { 

    return this.userService.createUser(
      body,
      req.user.tenantId
    );
  }

  // CHANGE ROLE
  @ApiOperation({
  summary: "Update user role"
})
  @Put(":id/role")
@Roles("ADMIN")
updateRole(
  @Param("id") id: string,
  @Body() body: UpdateRoleDto,
  @Req() req: any
) {

   return this.userService.updateRole(
  id,
  body.role,
  req.user.tenantId
);
  }



@ApiOperation({
  summary: "Enable user"
})
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

@ApiOperation({
  summary: "Disable user"
})
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
@ApiOperation({
  summary: "Get profile"
})
@Get("profile")
@Roles(
  "ADMIN",
  "MANAGER",
  "HR",
  "FINANCE",
  "SALES",
  "EMPLOYEE"
)
getProfile(
  @Req() req: any
) {

  return this.userService.getProfile(
    req.user.userId
  );
}

// UPDATE PROFILE
@ApiOperation({
  summary: "Update profile"
})
@Put("profile")
@Roles(
  "ADMIN",
  "MANAGER",
  "HR",
  "FINANCE",
  "SALES",
  "EMPLOYEE"
)
updateProfile(
  @Body() body: UpdateProfileDto,
  @Req() req: any
) {

  return this.userService.updateProfile(
    req.user.userId,
    body
  );
}




@ApiOperation({
  summary: "Change password"
})
@Put("change-password")
@Roles(
  "ADMIN",
  "MANAGER",
  "HR",
  "FINANCE",
  "SALES",
  "EMPLOYEE"
)
changePassword(
  @Body() body: ChangePasswordDto,
  @Req() req: any
) {

  return this.userService.changePassword(
    req.user.userId,
    body
  );
}

}
