import { CreateReceivableDto }
from "./dto/create-receivable.dto";

import { UpdateAccountDto }
from "./dto/update-account.dto";
import { CreateTransactionDto }
from "./dto/create-transaction.dto";
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Put,
  Req,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CreatePayableDto }
from "./dto/create-payable.dto";

import { FinanceService } from "./finance.service";

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

@ApiTags("Finance")

@ApiBearerAuth()

@Controller("finance")
export class FinanceController {

  constructor(
    private service: FinanceService
  ) {}

  // GET TRANSACTIONS
  @Get("transactions")
  @Roles("ADMIN", "FINANCE")
  getTransactions(
    @Req() req: any,
    @Query("search") search?: string
  ) {

    return this.service.getTransactions(
      req.user.tenantId,
      search || ""
    );
  }

// CREATE TRANSACTION
@Post("transactions")
@Roles("ADMIN")
  createTransaction(
  @Body() body: CreateTransactionDto,
  @Req() req: any
) {

  return this.service.createTransaction(

    body,

    req.user.tenantId,

    req.user.email
  );
}
// DELETE TRANSACTION
@Delete("transactions/:id")
@Roles("ADMIN")
deleteTransaction(
  @Param("id") id: string,
  @Req() req: any
) {

  return this.service.deleteTransaction(

    id,

    req.user.tenantId,

    req.user.email
  );
}
  // GET ACCOUNTS
  @Get("accounts")
  @Roles("ADMIN", "FINANCE")
  getAccounts(
    @Req() req: any
  ) {

    return this.service.getAccounts(
      req.user.tenantId
    );
  }

  @Get("accounts/:id")
@Roles("ADMIN", "FINANCE")
getAccount(
  @Param("id") id: string,
  @Req() req: any,
) {
  return this.service.getAccount(
    id,
    req.user.tenantId,
  );
}

@Put("accounts/:id")
@Roles("ADMIN")
updateAccount(
  @Param("id") id: string,
  @Body() body: UpdateAccountDto,
  @Req() req: any,
) {
  return this.service.updateAccount(
    id,
    body,
    req.user.tenantId,
    req.user.email,
  );
}

@Delete("accounts/:id")
@Roles("ADMIN")
deleteAccount(
  @Param("id") id: string,
  @Req() req: any,
) {
  return this.service.deleteAccount(
    id,
    req.user.tenantId,
    req.user.email,
  );
}

  // CREATE ACCOUNT
  @Post("accounts")
  @Roles("ADMIN")
  createAccount(
    @Body() body: any,
    @Req() req: any
  ) {

    return this.service.createAccount(
  body,
  req.user.tenantId,
  req.user.email,
);
  }

  // GET LEDGER
  @Get("ledger")
  @Roles("ADMIN", "FINANCE")
  getLedger(
    @Req() req: any
  ) {

    return this.service.getLedger(
      req.user.tenantId
    );
  }
    // CREATE PAYABLE
  @Post("payables")
  @Roles("ADMIN")
  createPayable(
    @Body() body: CreatePayableDto,
    @Req() req: any
  ) {

    return this.service.createPayable(
      body,
      req.user.tenantId
    );
  }

  // GET PAYABLES
  @Get("payables")
  @Roles("ADMIN", "FINANCE")
  getPayables(
    @Req() req: any
  ) {

    return this.service.getPayables(
      req.user.tenantId
    );
  }

 // MARK PAYABLE PAID
@Post("payables/:id/pay")
@Roles("ADMIN")
markPayablePaid(
  @Param("id") id: string,
  @Req() req: any
) {

  return this.service.markPayablePaid(

    id,

    req.user.tenantId
  );
}
    // CREATE RECEIVABLE
  @Post("receivables")
  @Roles("ADMIN")
  createReceivable(
    @Body() body: CreateReceivableDto,
    @Req() req: any
  ) {

    return this.service.createReceivable(
      body,
      req.user.tenantId
    );
  }

  // GET RECEIVABLES
  @Get("receivables")
  @Roles("ADMIN", "FINANCE")
  getReceivables(
    @Req() req: any
  ) {

    return this.service.getReceivables(
      req.user.tenantId
    );
  }

      // MARK RECEIVED
   @Post("receivables/:id/receive")
@Roles("ADMIN")
markReceivableReceived(
  @Param("id") id: string,
  @Req() req: any
) {

  return this.service
    .markReceivableReceived(

      id,

      req.user.tenantId
    );
}
}