import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CreateNotificationDto }
from "./dto/create-notification.dto";

import { NotificationsService }
from "./notifications.service";

import { JwtAuthGuard }
from "../auth/jwt.guard";

import { RolesGuard }
from "../auth/roles.guard";

import { Roles }
from "../auth/roles.decorator";

import {
  ApiBearerAuth,
  ApiTags,
} from "@nestjs/swagger";

@UseGuards(
  JwtAuthGuard,
  RolesGuard
)

@ApiTags("Notifications")

@ApiBearerAuth()

@Controller("notifications")
export class NotificationsController {

  constructor(
    private service:
    NotificationsService
  ) {}

  // GET
  @Get()
@Roles(
  "ADMIN",
  "MANAGER",
  "HR",
  "FINANCE",
  "SALES",
  "EMPLOYEE"
)
  getAll(
    @Req() req: any
  ) {

    return this.service.getAll(
      req.user.tenantId
    );
  }

  // CREATE
  @Post()
  @Roles(
  "ADMIN",
  "MANAGER"
)
  create(
    @Body() body: CreateNotificationDto,
    @Req() req: any
  ) {

    return this.service.create(
      body,
      req.user.tenantId
    );
  }

@Delete(":id")
@Roles(
  "ADMIN",
  "MANAGER",
  "HR",
  "FINANCE",
  "SALES",
  "EMPLOYEE"
)
deleteNotification(

  @Param("id")
  id: string,

  @Req()
  req: any
) {

  return this.service.deleteNotification(

    id,

    req.user.tenantId
  );
}

  // MARK READ
@Put(":id/read")
@Roles(
  "ADMIN",
  "MANAGER",
  "HR",
  "FINANCE",
  "SALES",
  "EMPLOYEE"
)
  markAsRead(
  @Param("id") id: string,
  @Req() req: any
) {
return this.service.markAsRead(
  id,
  req.user.tenantId
);
  }
}