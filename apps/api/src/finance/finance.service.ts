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
  filters: {
  search?: string;
  fromDate?: string;
  toDate?: string;

  type?: string;
  accountId?: string;

  minAmount?: string;
  maxAmount?: string;

  sortBy?: string;
},
) {

  const where: any = {
    tenantId,
  };

  // Search by description/type/account
  if (filters.search) {

    where.OR = [

      {
        type: {
          contains: filters.search,
          mode: "insensitive",
        },
      },

      {
        description: {
          contains: filters.search,
          mode: "insensitive",
        },
      },

      {
        account: {
          name: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
      },

    ];

  }

  // Date filter
  if (filters.fromDate || filters.toDate) {

    where.createdAt = {};

    if (filters.fromDate) {

      where.createdAt.gte = new Date(filters.fromDate);

    }

    if (filters.toDate) {

      const end = new Date(filters.toDate);

      end.setHours(23, 59, 59, 999);

      where.createdAt.lte = end;

    }

  }
if (filters.type) {

  where.type = filters.type;

}

if (filters.accountId) {

  where.accountId = filters.accountId;

}

if (filters.minAmount || filters.maxAmount) {

  where.amount = {};

  if (filters.minAmount) {

    where.amount.gte = Number(filters.minAmount);

  }

  if (filters.maxAmount) {

    where.amount.lte = Number(filters.maxAmount);

  }

}
  const transactions = await this.prisma.transaction.findMany({

    where,

    include: {
      account: true,
    },

    orderBy:
  filters.sortBy === "oldest"
    ? {
        createdAt: "asc",
      }
    : filters.sortBy === "highest"
    ? {
        amount: "desc",
      }
    : filters.sortBy === "lowest"
    ? {
        amount: "asc",
      }
    : {
        createdAt: "desc",
      },

  });

  return {

    success: true,

    data: transactions,

  };

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

async getFinanceSummary(
  tenantId: string,
) {

  const income =
    await this.prisma.transaction.aggregate({

      where: {

        tenantId,

        type: "INCOME",

      },

      _sum: {

        amount: true,

      },

    });

  const expense =
    await this.prisma.transaction.aggregate({

      where: {

        tenantId,

        type: "EXPENSE",

      },

      _sum: {

        amount: true,

      },

    });

  const receivable =
    await this.prisma.receivable.aggregate({

      where: {

        tenantId,

        status: "PENDING",

      },

      _sum: {

        amount: true,

      },

    });

  const payable =
    await this.prisma.payable.aggregate({

      where: {

        tenantId,

        status: "PENDING",

      },

      _sum: {

        amount: true,

      },

    });

  const account =
    await this.prisma.account.findFirst({

      where: {

        tenantId,

      },

    });

  const transactionCount =
    await this.prisma.transaction.count({

      where: {

        tenantId,

      },

    });

  const totalIncome =
    income._sum.amount || 0;

  const totalExpense =
    expense._sum.amount || 0;

  return {

    success: true,

    data: {

      totalIncome,

      totalExpense,

      netProfit:
        totalIncome - totalExpense,

      totalReceivable:
        receivable._sum.amount || 0,

      totalPayable:
        payable._sum.amount || 0,

      cashBalance:
        account?.balance || 0,

      transactionCount,

    },

  };

}

async getAnalytics(
  tenantId: string,
) {

  const [
    transactions,
    payables,
    receivables,
  ] = await Promise.all([

    this.prisma.transaction.findMany({
      where: {
        tenantId,
      },
    }),

    this.prisma.payable.findMany({
      where: {
        tenantId,
      },
    }),

    this.prisma.receivable.findMany({
      where: {
        tenantId,
      },
    }),

  ]);

  const income = transactions
    .filter(t => t.type === "INCOME")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter(t => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const outstandingPayables = payables
    .filter(p => p.status === "PENDING")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const outstandingReceivables = receivables
    .filter(r => r.status === "PENDING")
    .reduce((sum, r) => sum + Number(r.amount), 0);

  return {

    success: true,

    data: {

      income,

      expense,

      profit: income - expense,

      transactionCount: transactions.length,

      outstandingPayables,

      outstandingReceivables,

      totalPayables: payables.length,

      totalReceivables: receivables.length,

    },

  };

}
async getTrialBalance(
  tenantId: string,
) {

  const accounts =
    await this.prisma.account.findMany({

      where: {
        tenantId,
      },

      include: {
        ledgers: true,
      },

      orderBy: {
        name: "asc",
      },

    });

  const data =
    accounts.map(account => {

      const debit =
        account.ledgers.reduce(

          (sum, ledger) =>
            sum + ledger.debit,

          0,

        );

      const credit =
        account.ledgers.reduce(

          (sum, ledger) =>
            sum + ledger.credit,

          0,

        );

      return {

        accountId:
          account.id,

        accountName:
          account.name,

        debit,

        credit,

        balance:
          credit - debit,

      };

    });

  return {

    success: true,

    data,

  };

}

async getProfitAndLoss(
  tenantId: string,
) {

  const income =
    await this.prisma.transaction.aggregate({

      where: {

        tenantId,

        type: "INCOME",

      },

      _sum: {

        amount: true,

      },

    });

  const expense =
    await this.prisma.transaction.aggregate({

      where: {

        tenantId,

        type: "EXPENSE",

      },

      _sum: {

        amount: true,

      },

    });

  const totalIncome =
    income._sum.amount || 0;

  const totalExpense =
    expense._sum.amount || 0;

  const grossProfit =
    totalIncome - totalExpense;

  return {

    success: true,

    data: {

      totalIncome,

      totalExpense,

      grossProfit,

      profitMargin:

        totalIncome === 0

          ? 0

          : Number(

              (

                (grossProfit / totalIncome) *

                100

              ).toFixed(2)

            ),

    },

  };

}
async getBalanceSheet(
  tenantId: string,
) {

  const accounts =
    await this.prisma.account.aggregate({

      where: {
        tenantId,
      },

      _sum: {
        balance: true,
      },

    });

  const payable =
    await this.prisma.payable.aggregate({

      where: {
        tenantId,
        status: "PENDING",
      },

      _sum: {
        amount: true,
      },

    });

  const assets =
    accounts._sum.balance || 0;

  const liabilities =
    payable._sum.amount || 0;

  const equity =
    assets - liabilities;

  return {

    success: true,

    data: {

      assets,

      liabilities,

      equity,

    },

  };

}

async getCashFlow(
  tenantId: string,
) {

  const income =
    await this.prisma.transaction.aggregate({

      where: {

        tenantId,

        type: "INCOME",

      },

      _sum: {

        amount: true,

      },

    });

  const expense =
    await this.prisma.transaction.aggregate({

      where: {

        tenantId,

        type: "EXPENSE",

      },

      _sum: {

        amount: true,

      },

    });

  const cashIn =
    income._sum.amount || 0;

  const cashOut =
    expense._sum.amount || 0;

  return {

    success: true,

    data: {

      cashIn,

      cashOut,

      netCashFlow:
        cashIn - cashOut,

    },

  };

}

async getMonthlyAnalytics(
  tenantId: string,
) {

  const transactions =
    await this.prisma.transaction.findMany({

      where: {
        tenantId,
      },

      orderBy: {
        createdAt: "asc",
      },

    });

  const monthly: Record<
    string,
    {
      income: number;
      expense: number;
    }
  > = {};

  for (const tx of transactions) {

    const month =
      tx.createdAt.toLocaleString(
        "en-US",
        {
          month: "short",
          year: "numeric",
        },
      );

    if (!monthly[month]) {

      monthly[month] = {

        income: 0,

        expense: 0,

      };

    }

    if (tx.type === "INCOME") {

      monthly[month].income += tx.amount;

    } else {

      monthly[month].expense += tx.amount;

    }

  }

  return {

    success: true,

    data: Object.entries(monthly).map(

      ([month, values]) => ({

        month,

        income: values.income,

        expense: values.expense,

      }),

    ),

  };

}

async getFinanceKPIs(
  tenantId: string,
) {

  const [
    accounts,
    income,
    expense,
    payables,
    receivables,
  ] = await Promise.all([

    this.prisma.account.aggregate({
      where: { tenantId },
      _sum: { balance: true },
    }),

    this.prisma.transaction.aggregate({
      where: {
        tenantId,
        type: "INCOME",
      },
      _sum: { amount: true },
    }),

    this.prisma.transaction.aggregate({
      where: {
        tenantId,
        type: "EXPENSE",
      },
      _sum: { amount: true },
    }),

    this.prisma.payable.aggregate({
      where: {
        tenantId,
        status: "PENDING",
      },
      _sum: { amount: true },
    }),

    this.prisma.receivable.aggregate({
      where: {
        tenantId,
        status: "PENDING",
      },
      _sum: { amount: true },
    }),

  ]);

  const totalIncome =
    income._sum.amount || 0;

  const totalExpense =
    expense._sum.amount || 0;

  return {

    success: true,

    data: {

      accountBalance:
        accounts._sum.balance || 0,

      totalIncome,

      totalExpense,

      netProfit:
        totalIncome - totalExpense,

      pendingPayables:
        payables._sum.amount || 0,

      pendingReceivables:
        receivables._sum.amount || 0,

    },

  };

}

}