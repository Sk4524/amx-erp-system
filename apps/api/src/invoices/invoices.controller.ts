import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Req,
  Query,
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


@Get("summary")
@Roles(
  "ADMIN",
  "FINANCE",
)
getInvoiceSummary(
  @Req() req: any,
) {

  return this.service.getInvoiceSummary(
    req.user.tenantId,
  );

}

@Get("analytics")
@Roles(
  "ADMIN",
  "FINANCE",
)
getInvoiceAnalytics(
  @Req() req: any,
) {

  return this.service.getInvoiceAnalytics(
    req.user.tenantId,
  );

}

@Get("monthly-analytics")
@Roles(
  "ADMIN",
  "FINANCE",
)
getMonthlyInvoiceAnalytics(
  @Req() req: any,
) {

  return this.service.getMonthlyInvoiceAnalytics(
    req.user.tenantId,
  );

}

@Get(":id")
@Roles(
  "ADMIN",
  "FINANCE",
)
getInvoiceById(
  @Param("id") id: string,
  @Req() req: any,
) {

  return this.service.getInvoiceById(

    id,

    req.user.tenantId,

  );

}

@Get()
@Roles(
  "ADMIN",
  "FINANCE",
)
getInvoices(
  @Req() req: any,
  @Query("search") search?: string,
) {

  return this.service.getInvoices(

    req.user.tenantId,

    search || "",

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