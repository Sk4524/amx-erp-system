import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Req,
  UseGuards,
} from "@nestjs/common";

import {
  ApiTags,
  ApiBearerAuth,
} from "@nestjs/swagger";

import { JwtAuthGuard }
from "../auth/jwt.guard";

import { RolesGuard }
from "../auth/roles.guard";

import { Roles }
from "../auth/roles.decorator";

import { InvoicesService }
from "./invoices.service";

import { CreateInvoiceDto }
from "./dto/create-invoice.dto";

@UseGuards(
  JwtAuthGuard,
  RolesGuard
)

@ApiTags("Invoices")

@ApiBearerAuth()

@Controller("invoices")
export class InvoicesController {

  constructor(
    private service:
    InvoicesService
  ) {}

  @Get()
  @Roles(
    "ADMIN",
    "FINANCE"
  )
  getInvoices(
    @Req() req: any
  ) {

    return this.service.getInvoices(
      req.user.tenantId
    );
  }

  @Post()
  @Roles("ADMIN")
  createInvoice(
    @Body()
    body: CreateInvoiceDto,

    @Req()
    req: any
  ) {

    return this.service.createInvoice(

      body,

      req.user.tenantId
    );
  }

  @Put(":id/pay")
  @Roles("ADMIN")
  markPaid(
    @Param("id")
    id: string
  ) {

    return this.service.markPaid(id);
  }
}