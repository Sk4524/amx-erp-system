import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
} from "@nestjs/common";

import { SalesService } from "./sales.service";

import { CreateCustomerDto }
from "./dto/create-customer.dto";

import { CreateSalesOrderDto }
from "./dto/create-sales-order.dto";

import { JwtAuthGuard } from "../auth/jwt.guard";

import { RolesGuard } from "../auth/roles.guard";

import { Roles } from "../auth/roles.decorator";

import {
  ApiBearerAuth,
  ApiTags,
} from "@nestjs/swagger";

@UseGuards(
  JwtAuthGuard,
  RolesGuard
)

@ApiTags("Sales")

@ApiBearerAuth()

@Controller("sales")
export class SalesController {

  constructor(
    private service: SalesService
  ) {}

  // GET CUSTOMERS
  @Get("customers")
  @Roles(
  "ADMIN",
  "SALES",
  "MANAGER"
)
  getCustomers(
    @Req() req: any
  ) {

    return this.service.getCustomers(
      req.user.tenantId
    );
  }

  // CREATE CUSTOMER
  @Post("customers")
  @Roles(
  "ADMIN",
  "SALES"
)
  createCustomer(
    @Body() body: CreateCustomerDto,
    @Req() req: any
  ) {

    return this.service.createCustomer(
  body,
  req.user.tenantId,
  req.user.email
);
  }

  // GET SALES ORDERS
  @Get("orders")
  @Roles(
  "ADMIN",
  "SALES",
  "MANAGER"
)
  getSalesOrders(
    @Req() req: any
  ) {

    return this.service.getSalesOrders(
      req.user.tenantId
    );
  }

  // CREATE SALES ORDER
  @Post("orders")
  @Roles(
  "ADMIN",
  "SALES"
)
  createSalesOrder(
    @Body() body: CreateSalesOrderDto,
    @Req() req: any
  ) {
return this.service.createSalesOrder(
  body,
  req.user.tenantId,
  req.user.email
);
  }
}