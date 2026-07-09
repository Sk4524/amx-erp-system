import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

import { AuditService }
from "../audit/audit.service";

import { RealtimeGateway }
from "../realtime/realtime.gateway";


@Injectable()
export class FinanceService {

constructor(

  private prisma:
  PrismaService,

  private auditService:
  AuditService,

  private realtimeGateway:
  RealtimeGateway

) {}
  // GET ALL TRANSACTIONS
  async getTransactions(
    tenantId: string,
    search = ""
  ) {

    return this.prisma.transaction.findMany({

      where: {

        tenantId,

        type: {
          contains: search,
          mode: "insensitive",
        },
      },

      include: {
        account: true,
        ledger: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // CREATE TRANSACTION
  async createTransaction(
  data: any,
  tenantId: string,
  userEmail = "SYSTEM"
) 
{const mainAccount =
  await this.prisma.account.findFirst({
    where: {
      tenantId,
    },
  });

if (!mainAccount) {
  throw new Error(
    "Main account not found"
  );
}

    try {

      console.log(
        "TRANSACTION DATA:",
        data
      );

      console.log(
        "TENANT ID:",
        tenantId
      );

      // CREATE TRANSACTION
      const transaction =
        await this.prisma.transaction.create({

          data: {

            amount:
              Number(data.amount),

            type:
              data.type,

            accountId:
  mainAccount.id,

            tenantId,
          },
        });
await this.prisma.account.update({
  where: {
    id: mainAccount.id,
  },

  data: {
    balance:
      data.type === "INCOME"
        ? {
            increment:
              Number(data.amount),
          }
        : {
            decrement:
              Number(data.amount),
          },
  },
});
      console.log(
        "TRANSACTION CREATED:",
        transaction
      );

      // CREATE LEDGER ENTRY
      const ledger =
        await this.prisma.ledger.create({

          data: {

            description:
              `${data.type} Transaction`,

            debit:
              data.type === "EXPENSE"
                ? Number(data.amount)
                : 0,

            credit:
              data.type === "INCOME"
                ? Number(data.amount)
                : 0,

            transactionId:
              transaction.id,
accountId:
  mainAccount.id,

            tenantId,

            reference:
              data.reference || "",
          },
        });

      console.log(
        "LEDGER CREATED:",
        ledger
      );
// AUDIT LOG
await this.auditService.createLog({

  action: "CREATE",

  module: "FINANCE",

  description:
    `Created ${transaction.type} transaction of ₹${transaction.amount}`,

  userEmail,

  tenantId,
});

// REALTIME EVENTS

this.realtimeGateway.financeUpdated({

  type:
    transaction.type,

  amount:
    transaction.amount,

  transactionId:
    transaction.id,
});

this.realtimeGateway.dashboardRefresh();

this.realtimeGateway.sendNotification({

  title:
    "Finance Updated",

  message:
    `${transaction.type} transaction of ₹${transaction.amount} created.`,
});
      return {
  success: true,
  message: "Transaction created",
  data: transaction,
};

    } catch (error) {

  console.log(
    "FINANCE CREATE ERROR:"
  );

  console.error(error);

  throw error;
}
  }


  // DELETE TRANSACTION
 async deleteTransaction(
  id: string,
  tenantId: string,
  userEmail = "SYSTEM"
) {

  const transaction =
    await this.prisma.transaction.findFirst({

      where: {

        id,

        tenantId,
      },
    });

  if (!transaction) {

   throw new NotFoundException(
  "Transaction not found"
);
  }

  await this.prisma.ledger.deleteMany({

    where: {
      transactionId: id,
    },
  });
await this.prisma.account.update({
  where: {
    id: transaction.accountId,
  },

  data: {
    balance:
      transaction.type === "INCOME"
        ? {
            decrement: transaction.amount,
          }
        : {
            increment: transaction.amount,
          },
  },
});
const deletedTransaction =
  await this.prisma.transaction.delete({

    where: {
      id,
    },
  });

await this.auditService.createLog({

  action:
    "TRANSACTION_DELETED",

  module:
    "FINANCE",

  description:
    `Deleted ${transaction.type} transaction of ₹${transaction.amount}`,

  userEmail,

  tenantId,
});

return {
  success: true,
  message: "Transaction deleted",
  data: deletedTransaction,
};
}

  // GET ACCOUNTS
  async getAccounts(
  tenantId: string
) {

  const accounts =
    await this.prisma.account.findMany({

      where: {
        tenantId,
      },

      orderBy: {
        name: "asc",
      },
    });

  console.log(
    "ACCOUNTS FOUND:",
    accounts
  );

  return {
  success: true,
  message: "Accounts fetched",
  data: accounts,
};
}


  // CREATE ACCOUNT
async createAccount(
  data: any,
  tenantId: string,
  userEmail = "SYSTEM"
){

  const account =
    await this.prisma.account.create({

      data: {
        ...data,
        tenantId,
      },
    });

  await this.auditService.createLog({

    action:
      "ACCOUNT_CREATED",

    module:
      "FINANCE",

    description:
      `Created account ${account.name}`,

    userEmail,

    tenantId,
  });

  return {
  success: true,
  message: "Account created",
  data: account,
};
}

  // GET LEDGER ENTRIES
  async getLedger(
    tenantId: string
  ) {

    const ledger = await this.prisma.ledger.findMany({

  where: {
    tenantId,
  },

  include: {
    account: true,
    transaction: true,
  },

  orderBy: {
    createdAt: "desc",
  },
});

return {
  success: true,
  message: "Ledger fetched",
  data: ledger,
};
  }
   // CREATE PAYABLE
async createPayable(
  data: any,
  tenantId: string
) {

  const payable =
    await this.prisma.payable.create({

      data: {

        vendorName:
          data.vendorName,

        amount:
          Number(data.amount),

        dueDate:
          new Date(data.dueDate),

        tenantId,
      },
    });

  this.realtimeGateway.sendNotification({

    title:
      "New Payable",

    message:
      `${payable.vendorName} payable created.`,
  });

  this.realtimeGateway.dashboardRefresh();

await this.auditService.createLog({

  action:
    "PAYABLE_CREATED",

  module:
    "FINANCE",

  description:
    `Payable created for ${payable.vendorName}`,

  userEmail:
    "SYSTEM",

  tenantId,
});

return {
  success: true,
  message: "Payable created",
  data: payable,
};
}
  // GET PAYABLES
  async getPayables(
    tenantId: string
  ) {

    const payables =
  await this.prisma.payable.findMany({

    where: {
      tenantId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

return {
  success: true,
  message: "Payables fetched",
  data: payables,
};
  }

  // MARK PAYABLE PAID
async markPayablePaid(
  id: string,
  tenantId: string
){

  const payable =
    await this.prisma.payable.findFirst({

      where: {

        id,

        tenantId,
      },
    });

  if (!payable) {

  throw new NotFoundException(
  "Payable not found"
);
  }

  const updatedPayable =
    await this.prisma.payable.update({

      where: {
        id,
      },

      data: {
        status: "PAID",
      },
      
    });
await this.createTransaction(
  {
    amount:
      updatedPayable.amount,

    type:
      "EXPENSE",
  },
  tenantId,
  "SYSTEM"
);
  this.realtimeGateway.financeUpdated({

    type:
      "PAYABLE_PAID",

    amount:
      updatedPayable.amount,
  });

  this.realtimeGateway.sendNotification({

    title:
      "Payable Paid",

    message:
      `${updatedPayable.vendorName} payment completed.`,
  });

  this.realtimeGateway.dashboardRefresh();

await this.auditService.createLog({

  action:
    "PAYABLE_PAID",

  module:
    "FINANCE",

  description:
    `${updatedPayable.vendorName} payable settled`,

  userEmail:
    "SYSTEM",

  tenantId,
});

return {
  success: true,
  message: "Payable marked as paid",
  data: updatedPayable,
};
}
// CREATE RECEIVABLE
async createReceivable(
  data: any,
  tenantId: string
) {

  const receivable =
    await this.prisma.receivable.create({

      data: {

        customerName:
          data.customerName,

        amount:
          Number(data.amount),

        dueDate:
          new Date(data.dueDate),

        tenantId,
      },
    });

  this.realtimeGateway.sendNotification({

    title:
      "New Receivable",

    message:
      `${receivable.customerName} receivable created.`,
  });

  this.realtimeGateway.dashboardRefresh();

await this.auditService.createLog({

  action:
    "RECEIVABLE_CREATED",

  module:
    "FINANCE",

  description:
    `Receivable created for ${receivable.customerName}`,

  userEmail:
    "SYSTEM",

  tenantId,
});

return {
  success: true,
  message: "Receivable created",
  data: receivable,
};
}

  // GET RECEIVABLES
  async getReceivables(
    tenantId: string
  ) {
const receivables =
  await this.prisma.receivable.findMany({

    where: {
      tenantId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

return {
  success: true,
  message: "Receivables fetched",
  data: receivables,
};
  }

  // MARK RECEIVABLE RECEIVED
 async markReceivableReceived(
  id: string,
  tenantId: string
) {

  const receivable =
    await this.prisma.receivable.findFirst({

      where: {

        id,

        tenantId,
      },
    });

  if (!receivable) {

 throw new NotFoundException(
  "Receivable not found"
);
  }

  const updatedReceivable =
    await this.prisma.receivable.update({

      where: {
        id,
      },

      data: {
        status: "RECEIVED",
      },
    });

    await this.createTransaction(
  {
    amount:
      updatedReceivable.amount,

    type:
      "INCOME",
  },
  tenantId,
  "SYSTEM"
);

  this.realtimeGateway.financeUpdated({

    type:
      "RECEIVABLE_RECEIVED",

    amount:
      updatedReceivable.amount,
  });

  this.realtimeGateway.sendNotification({

    title:
      "Receivable Received",

    message:
      `${updatedReceivable.customerName} payment received.`,
  });

  this.realtimeGateway.dashboardRefresh();

await this.auditService.createLog({

  action:
    "RECEIVABLE_RECEIVED",

  module:
    "FINANCE",

  description:
    `${updatedReceivable.customerName} payment received`,

  userEmail:
    "SYSTEM",

  tenantId,
});

return {
  success: true,
  message: "Receivable marked as received",
  data: updatedReceivable,
};
}

async getAccount(
  id: string,
  tenantId: string,
) {

  const account =
    await this.prisma.account.findFirst({

      where: {
        id,
        tenantId,
      },

    });

  if (!account) {

    throw new NotFoundException(
      "Account not found",
    );

  }

  return {
    success: true,
    message: "Account fetched",
    data: account,
  };

}

async updateAccount(
  id: string,
  data: any,
  tenantId: string,
  userEmail = "SYSTEM",
) {

  const account =
    await this.prisma.account.findFirst({

      where: {
        id,
        tenantId,
      },

    });

  if (!account) {

    throw new NotFoundException(
      "Account not found",
    );

  }

  const updated =
    await this.prisma.account.update({

      where: {
        id,
      },

      data,

    });

  await this.auditService.createLog({

    action: "ACCOUNT_UPDATED",

    module: "FINANCE",

    description:
      `Updated account ${updated.name}`,

    userEmail,

    tenantId,

  });

  return {

    success: true,

    message: "Account updated",

    data: updated,

  };

}

async deleteAccount(
  id: string,
  tenantId: string,
  userEmail = "SYSTEM",
) {

const account =
  await this.prisma.account.findFirst({

    where: {
      id,
      tenantId,
    },

    include: {
      transactions: true,
      ledgers: true,
    },

  });

  if (!account) {

    throw new NotFoundException(
      "Account not found",
    );

  }

if (

  account.transactions.length > 0 ||

  account.ledgers.length > 0

) {

  throw new Error(

    "Cannot delete account with existing transactions."

  );

}

  await this.prisma.account.delete({

    where: {
      id,
    },

  });

  await this.auditService.createLog({

    action: "ACCOUNT_DELETED",

    module: "FINANCE",

    description:
      `Deleted account ${account.name}`,

    userEmail,

    tenantId,

  });

  return {

    success: true,

    message: "Account deleted",

    data: account,

  };

}

}