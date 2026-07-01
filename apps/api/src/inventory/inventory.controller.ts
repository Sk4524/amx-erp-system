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
ApiOperation,
} from "@nestjs/swagger";

import { CreateInventoryDto } from "./dto/create-inventory.dto";
import { UpdateInventoryDto } from "./dto/update-inventory.dto";

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
@ApiOperation({
  summary: "Get all inventory items",
})
@Get()
@Roles(
  "ADMIN",
  "MANAGER",
  "SALES",
  "FINANCE",
)
getAll(
  @Req() req: any,
  @Query("search") search?: string,
) {

  return this.service.getAll(
    req.user.tenantId,
    search || "",
  );

}




  // CREATE INVENTORY
  @ApiOperation({
  summary: "Create inventory item",
})
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

//bulk inventory create
@ApiOperation({
  summary: "Bulk import inventory items",
})
@Post("bulk")
@Roles("ADMIN")
createBulk(
  @Body() body: CreateInventoryDto[],
  @Req() req: any,
) {
  return this.service.createBulk(
    body,
    req.user.tenantId,
  );
}
  // UPDATE INVENTORY
  @ApiOperation({
  summary: "Update inventory item",
})
  @Put(":id")
  @Roles("ADMIN")
  update(
  @Param("id") id: string,
  @Body() body: UpdateInventoryDto,
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
  @ApiOperation({
  summary: "Delete inventory item",
})
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
  @ApiOperation({
  summary: "Create purchase order",
})
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
  @ApiOperation({
  summary: "Get purchase orders",
})
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
  @ApiOperation({
  summary: "Complete purchase order",
})
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
  @ApiOperation({
  summary: "Get stock movement history",
})
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

@ApiOperation({
  summary: "Get inventory item by id",
})
@Get(":id")
@Roles(
  "ADMIN",
  "MANAGER",
  "SALES",
  "FINANCE",
)
getOne(
  @Param("id") id: string,
  @Req() req: any,
) {

  return this.service.getOne(
    id,
    req.user.tenantId,
  );

}
}