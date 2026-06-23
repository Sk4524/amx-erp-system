import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AnalyticsService {

  constructor(
    private prisma: PrismaService
  ) {}

  // DASHBOARD ANALYTICS
  async getDashboardAnalytics(
    tenantId: string
  ) {

    // EMPLOYEES
    const employees =
      await this.prisma.employee.count({

        where: {
          tenantId,
        },
      });

    // INVENTORY
    const inventory =
      await this.prisma.inventory.count({

        where: {
          tenantId,
        },
      });

    // LOW STOCK
    const lowStock =
      await this.prisma.inventory.count({

        where: {
          tenantId,

          quantity: {
            lte: 5,
          },
        },
      });

    // TRANSACTIONS
    const transactions =
      await this.prisma.transaction.findMany({

        where: {
          tenantId,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    // INCOME
    const income =
      transactions
        .filter(
          (t) => t.type === "INCOME"
        )
        .reduce(
          (a, b) => a + b.amount,
          0
        );

    // EXPENSE
    const expense =
      transactions
        .filter(
          (t) => t.type === "EXPENSE"
        )
        .reduce(
          (a, b) => a + b.amount,
          0
        );

    return {

      employees,

      inventory,

      lowStock,

      income,

      expense,

      totalTransactions:
        transactions.length,

      transactions,
    };
  }

  // ADVANCED ANALYTICS
  async getAdvancedAnalytics(
    tenantId: string
  ) {

    // TRANSACTIONS
    const transactions =
      await this.prisma.transaction.findMany({

        where: {
          tenantId,
        },

        orderBy: {
          createdAt: "asc",
        },
      });

    // INVENTORY
    const inventory =
      await this.prisma.inventory.findMany({

        where: {
          tenantId,
        },
      });

    // MONTHLY REVENUE
    const monthlyRevenue: any = {};

    // MONTHLY EXPENSE
    const monthlyExpense: any = {};

    transactions.forEach((tx) => {

      const month =
        new Date(
          tx.createdAt
        ).toLocaleString(
          "default",
          {
            month: "short",
          }
        );

      // INCOME
      if (tx.type === "INCOME") {

        monthlyRevenue[month] =
          (monthlyRevenue[month] || 0)
          + tx.amount;
      }

      // EXPENSE
      if (tx.type === "EXPENSE") {

        monthlyExpense[month] =
          (monthlyExpense[month] || 0)
          + tx.amount;
      }
    });

    // MONTHLY REVENUE ARRAY
    const monthlyRevenueData =
      Object.keys(monthlyRevenue)
        .map((month) => ({
          month,
          revenue:
            monthlyRevenue[month],
        }));

    // EXPENSE TREND ARRAY
    const expenseTrendData =
      Object.keys(monthlyExpense)
        .map((month) => ({
          month,
          expense:
            monthlyExpense[month],
        }));

    // INVENTORY DISTRIBUTION
    const categories: any = {};

    inventory.forEach((item) => {

      const category =
        item.category || "Other";

      categories[category] =
        (categories[category] || 0)
        + 1;
    });

    const inventoryDistribution =
      Object.keys(categories)
        .map((cat) => ({
          name: cat,
          value: categories[cat],
        }));

    // YEARLY GROWTH MOCK
    const yearlyGrowth = [
      {
        year: "2022",
        growth: 20,
      },
      {
        year: "2023",
        growth: 45,
      },
      {
        year: "2024",
        growth: 70,
      },
      {
        year: "2025",
        growth: 95,
      },
    ];

    return {

      monthlyRevenueData,

      expenseTrendData,

      inventoryDistribution,

      yearlyGrowth,
    };
  }
  // AI INSIGHTS
async getAIInsights(
  tenantId: string
) {

  // INVENTORY
  const inventory =
    await this.prisma.inventory.findMany({

      where: {
        tenantId,
      },
    });

  // SALES
  const salesOrders =
    await this.prisma.salesOrder.findMany({

      where: {
        tenantId,
      },
    });

  // TRANSACTIONS
  const transactions =
    await this.prisma.transaction.findMany({

      where: {
        tenantId,
      },
    });

  // LOW STOCK ITEMS
  const lowStockItems =
    inventory.filter(
      (i) => i.quantity <= 5
    );

  // TOTAL INCOME
const totalSales =
  transactions
    .filter(
      (t) =>
        t.type === "INCOME"
    )
    .reduce(
      (acc, curr) =>
        acc + curr.amount,
      0
    );

  // TOTAL EXPENSE
  const totalExpense =
    transactions
      .filter(
        (t) =>
          t.type === "EXPENSE"
      )
      .reduce(
        (acc, curr) =>
          acc + curr.amount,
        0
      );

  // PROFIT
  const profit =
    totalSales -
    totalExpense;

  // AI INSIGHTS ARRAY
  const insights = [];

  // LOW STOCK ALERT
  if (
    lowStockItems.length > 0
  ) {

    insights.push({

      type: "warning",

      title:
        "Low Stock Alert",

      message:
        `${lowStockItems.length} products are running low on stock.`,
    });
  }

  // PROFITABILITY
  if (profit > 0) {

    insights.push({

      type: "success",

      title:
        "Positive Revenue Trend",

      message:
        `Business is currently profitable with estimated profit of ₹${profit}.`,
    });

  } else {

    insights.push({

      type: "danger",

      title:
        "Negative Revenue Trend",

      message:
        `Expenses are exceeding revenue.`,
    });
  }

  // SALES INSIGHT
  if (
    salesOrders.length >= 5
  ) {

    insights.push({

      type: "info",

      title:
        "Strong Sales Activity",

      message:
        `Sales orders are increasing steadily.`,
    });
  }

  // INVENTORY HEALTH
  const healthyInventory =
    inventory.filter(
      (i) => i.quantity > 5
    ).length;

  if (
    healthyInventory >= 5
  ) {

    insights.push({

      type: "success",

      title:
        "Inventory Health Stable",

      message:
        `Most inventory products are sufficiently stocked.`,
    });
  }

  return {

    insights,

    totalSales,

    totalExpense,

    profit,

    lowStockItems:
      lowStockItems.length,
  };
}
}