import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Req,
  Body,
  UseGuards,
} from "@nestjs/common";

import {
  ApiTags,
  ApiBearerAuth,
} from "@nestjs/swagger";

import { UpdateVendorDto }
from "./dto/update-vendor.dto";

import { JwtAuthGuard }
from "../auth/jwt.guard";

import { RolesGuard }
from "../auth/roles.guard";

import { Roles }
from "../auth/roles.decorator";

import { VendorsService }
from "./vendors.service";

import { CreateVendorDto }
from "./dto/create-vendor.dto";

@UseGuards(
  JwtAuthGuard,
  RolesGuard
)

@ApiTags("Vendors")

@ApiBearerAuth()

@Controller("vendors")
export class VendorsController {

  constructor(
    private service:
    VendorsService
  ) {}

  // GET
  @Get()
  @Roles(
  "ADMIN",
  "MANAGER",
  "FINANCE"
)
  getVendors(
    @Req() req: any
  ) {

    return this.service.getVendors(
      req.user.tenantId
    );
  }

  // CREATE
  @Post()
  @Roles("ADMIN")
  createVendor(
    @Body() body: CreateVendorDto,
    @Req() req: any
  ) {

    return this.service.createVendor(
  body,
  req.user.tenantId,
  req.user.email
);
  }
@Put(":id")
@Roles("ADMIN")
updateVendor(
  @Param("id") id: string,
  @Body() body: UpdateVendorDto,
  @Req() req: any
) {

 return this.service.updateVendor(
  id,
  body,
  req.user.tenantId,
  req.user.email
);
}
  // DELETE
  @Delete(":id")
  @Roles("ADMIN")
 deleteVendor(
  @Param("id") id: string,
  @Req() req: any
) {

   return this.service.deleteVendor(
  id,
  req.user.tenantId,
  req.user.email
);
  }
}