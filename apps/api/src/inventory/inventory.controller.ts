import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
  Req,
  Query,
  UseGuards,
} from "@nestjs/common";

import { InventoryService } from "./inventory.service";

import { JwtAuthGuard } from "../auth/jwt.guard";

import { RolesGuard } from "../auth/roles.guard";

import { Roles } from "../auth/roles.decorator";

import {
  ApiBearerAuth,
  ApiTags,
} from "@nestjs/swagger";

import { CreateInventoryDto }
from "./dto/create-inventory.dto";

@UseGuards(
  JwtAuthGuard,
  RolesGuard
)

@ApiTags("Inventory")

@ApiBearerAuth()

@Controller("inventory")
export class InventoryController {

  constructor(
    private service: InventoryService
  ) {}

  // GET INVENTORY
@Get()
@Roles(
  "ADMIN",
  "MANAGER",
  "SALES",
  "FINANCE"
)
getAll(
  @Req() req: any,
  @Query("search") search?: string
) {

  return this.service.getAll(
    req.user.tenantId,
    search || ""
  );
}

  // CREATE INVENTORY
@Post()
@Roles("ADMIN")
create(
  @Body() body: CreateInventoryDto,
  @Req() req: any
) {

  return this.service.create(

    body,

    req.user.tenantId,

    req.user.email
  );
}

  // UPDATE INVENTORY
  @Put(":id")
  @Roles("ADMIN")
  update(
  @Param("id") id: string,
  @Body() body: CreateInventoryDto,
  @Req() req: any
) {

 return this.service.update(

  id,

  body,

  req.user.tenantId,

  req.user.email
);
}
  // DELETE INVENTORY
  @Delete(":id")
  @Roles("ADMIN")
  delete(
  @Param("id") id: string,
  @Req() req: any
) {
return this.service.delete(

  id,

  req.user.tenantId,

  req.user.email
);
}

  // CREATE PURCHASE ORDER
  @Post("purchase-orders")
  @Roles("ADMIN")
  createPurchaseOrder(
    @Body() body: any,
    @Req() req: any
  ) {

    return this.service.createPurchaseOrder(
  body,
  req.user.tenantId,
  req.user.email
);
  }

  // GET PURCHASE ORDERS
  @Get("purchase-orders")
  @Roles(
  "ADMIN",
  "MANAGER"
)
  getPurchaseOrders(
    @Req() req: any
  ) {

    return this.service.getPurchaseOrders(
      req.user.tenantId
    );
  }

  // COMPLETE PURCHASE ORDER
  @Post("purchase-orders/:id/complete")
  @Roles("ADMIN")
  completePurchaseOrder(
  @Param("id") id: string,
  @Req() req: any
) {

  return this.service.completePurchaseOrder(

    id,

    req.user.tenantId,

    req.user.email
  );

  }
  // GET STOCK MOVEMENTS
@Get("stock-movements")
@Roles(
  "ADMIN",
  "MANAGER",
  "FINANCE"
)
getStockMovements(
  @Req() req: any
) {

  return this.service.getStockMovements(
    req.user.tenantId
  );
}
}