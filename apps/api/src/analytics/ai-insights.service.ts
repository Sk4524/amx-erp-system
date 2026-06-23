import { Injectable }
from "@nestjs/common";

import { PrismaService }
from "../prisma/prisma.service";

@Injectable()

export class AIInsightsService {

  constructor(

    private prisma:
    PrismaService

  ) {}

  // GENERATE AI INSIGHTS
  async generateInsights(
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
    const sales =
      await this.prisma.salesOrder.findMany({

        where: {
          tenantId,
        },
      });

      // EMPLOYEES
const employees =
  await this.prisma.employee.findMany({

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

    // LOW STOCK
    const lowStock =
      inventory.filter(
        (item) =>
          item.quantity <= 5
      );

    // TOTAL REVENUE
    const revenue =
  transactions
    .filter(
      (t) =>
        t.type === "INCOME"
    )
    .reduce(
      (sum, tx) =>
        sum + tx.amount,
      0
    );

    // TOTAL EXPENSE
    const expenses =
      transactions
        .filter(
          (t) =>
            t.type === "EXPENSE"
        )
        .reduce(
          (sum, tx) =>
            sum + tx.amount,
          0
        );

    // PROFIT
    const estimatedProfit =
      revenue - expenses;
// BUSINESS HEALTH SCORE
let businessHealth = 100;

// EXPENSE RISK
if (
  expenses > revenue * 0.8
) {

  businessHealth -= 30;
}

// LOW STOCK RISK
if (
  lowStock.length > 5
) {

  businessHealth -= 20;
}

// LOW SALES
if (
  sales.length < 5
) {

  businessHealth -= 20;
}

// NO INVENTORY
if (
  inventory.length === 0
) {

  businessHealth -= 30;
}

// LIMIT SCORE
businessHealth =
  Math.max(
    businessHealth,
    10
  );
    const insights = [];

    // AI BUSINESS PREDICTIONS
const predictions = [];

// AI FINANCIAL INTELLIGENCE
const financialInsights = [];

// CASHFLOW
const cashflow =
  revenue - expenses;

// HEALTHY CASHFLOW
if (
  cashflow > 50000
) {

  financialInsights.push({

    type: "success",

    title:
      "Healthy Cashflow",

    message:
      "AI detected strong positive operational cashflow.",

    value:
      `₹${cashflow}`,
  });

} else {

  financialInsights.push({

    type: "warning",

    title:
      "Cashflow Risk",

    message:
      "AI detected potential cashflow pressure due to operational spending.",

    value:
      `₹${cashflow}`,
  });
}

// EXPENSE ANALYSIS
const expenseRatio =
  revenue > 0
    ? (
        (expenses / revenue) *
        100
      ).toFixed(1)
    : "0";

financialInsights.push({

  type:
    Number(expenseRatio) > 70
      ? "danger"
      : "info",

  title:
    "Expense Ratio",

  message:
    "AI analyzed operational expense efficiency.",

  value:
    `${expenseRatio}%`,
});

// PROFITABILITY
financialInsights.push({

  type:
    estimatedProfit > 0
      ? "success"
      : "danger",

  title:
    "Profitability Analysis",

  message:
    estimatedProfit > 0
      ? "Business operations are currently profitable."
      : "AI detected profitability decline risk.",

  value:
    `₹${estimatedProfit}`,
});

// REVENUE PREDICTION
if (
  revenue > expenses
) {

  predictions.push({

    title:
      "Revenue Growth Prediction",

    prediction:
      "AI predicts positive business growth trend for upcoming months.",

    confidence: "87%",
  });

} else {

  predictions.push({

    title:
      "Profitability Risk",

    prediction:
      "AI detected risk of reduced profitability due to high expenses.",

    confidence: "82%",
  });
}

// INVENTORY PREDICTION
if (
  lowStock.length > 0
) {

  predictions.push({

    title:
      "Inventory Shortage Risk",

    prediction:
      "AI predicts inventory shortages if procurement is delayed.",

    confidence: "91%",
  });
}

// EMPLOYEE COST
const hrtotalSalary =
  employees.reduce(
    (sum, emp) =>
      sum + emp.salary,
    0
  );

if (
  hrtotalSalary >
  revenue * 0.5
) {

  predictions.push({

    title:
      "HR Cost Optimization",

    prediction:
      "Employee operational cost is rising compared to revenue.",

    confidence: "76%",
  });
}

    // REVENUE AI
    if (revenue > 100000) {

      insights.push({

        type: "success",

        title:
          "Strong Revenue Growth",

        message:
          `AI detected strong revenue performance with total sales of ₹${revenue}.`
      });

    } else {

      insights.push({

        type: "info",

        title:
          "Revenue Monitoring",

        message:
          `Current revenue stands at ₹${revenue}. AI recommends increasing sales activity for higher growth.`
      });
    }

    // EXPENSE AI
    if (
      expenses >
      revenue * 0.7
    ) {

      insights.push({

        type: "warning",

        title:
          "High Expense Ratio",

        message:
          "Operational expenses are consuming a large percentage of revenue."
      });

    } else {

      insights.push({

        type: "success",

        title:
          "Expense Control Stable",

        message:
          "Expense ratio is within healthy operational limits."
      });
    }

    // INVENTORY AI
    if (
      lowStock.length > 0
    ) {

      insights.push({

        type: "danger",

        title:
          "Inventory Risk Alert",

        message:
          `${lowStock.length} products are low on stock and require procurement planning.`
      });

    } else {

      insights.push({

        type: "success",

        title:
          "Inventory Health Stable",

        message:
          "AI detected healthy inventory levels across products."
      });
    }

    // SALES AI
    if (
      sales.length > 10
    ) {

      insights.push({

        type: "success",

        title:
          "Sales Momentum Rising",

        message:
          "Customer purchasing activity is increasing based on AI sales analysis."
      });

    } else {

      insights.push({

        type: "info",

        title:
          "Sales Activity Moderate",

        message:
          "AI recommends marketing and customer engagement to improve sales momentum."
      });
    }

    // AI HR INTELLIGENCE
const hrInsights = [];

// TOTAL SALARY
const totalSalary =
  employees.reduce(

    (sum, emp) =>

      sum + emp.salary,

    0
  );

// AVG SALARY
const avgSalary =
  employees.length > 0

    ? Math.round(
        totalSalary /
        employees.length
      )

    : 0;

// HR COST ANALYSIS
hrInsights.push({

  type:
    totalSalary > revenue * 0.5
      ? "warning"
      : "success",

  title:
    "Workforce Cost Analysis",

  message:
    totalSalary > revenue * 0.5

      ? "Employee salary expenses are consuming a high portion of revenue."

      : "Employee salary structure is financially healthy.",

  value:
    `₹${hrtotalSalary}`,
});

// AVERAGE SALARY
hrInsights.push({

  type: "info",

  title:
    "Average Salary",

  message:
    "AI analyzed average employee compensation.",

  value:
    `₹${avgSalary}`,
});

// EMPLOYEE GROWTH
hrInsights.push({

  type:
    employees.length >= 10
      ? "success"
      : "info",

  title:
    "Workforce Strength",

  message:
    employees.length >= 10

      ? "Organization workforce growth looks stable."

      : "AI recommends expanding workforce for scaling operations.",

  value:
    `${employees.length} Employees`,
});

// AI RISK ENGINE
const riskAlerts = [];

// LOW REVENUE RISK
if (revenue < 50000) {

  riskAlerts.push({

    level: "MEDIUM",

    title:
      "Revenue Risk",

    message:
      "AI detected lower revenue generation trends."
  });
}

// HIGH EXPENSE RISK
if (expenses > revenue * 0.8) {

  riskAlerts.push({

    level: "HIGH",

    title:
      "Expense Risk",

    message:
      "Business expenses are critically high compared to revenue."
  });
}

// INVENTORY RISK
if (lowStock.length > 3) {

  riskAlerts.push({

    level: "HIGH",

    title:
      "Inventory Shortage Risk",

    message:
      "Multiple products are running low on stock."
  });
}

// EMPLOYEE RISK
if (employees.length < 3) {

  riskAlerts.push({

    level: "LOW",

    title:
      "Workforce Risk",

    message:
      "AI recommends expanding workforce for business scalability."
  });
}

    // AI PROCUREMENT ENGINE
    const procurementRecommendations =
      lowStock.map((item) => {

        // PRODUCT SALES
        const productSales =
          sales.filter(
            (sale) =>
              sale.productName ===
              item.productName
          );

        // TOTAL SOLD
        const totalSold =
          productSales.reduce(
            (sum, sale) =>
              sum + sale.quantity,
            0
          );

        // AVG DEMAND
        const averageDemand =
          productSales.length > 0
            ? Math.ceil(
                totalSold /
                productSales.length
              )
            : 10;

        // SMART RESTOCK
        const recommendedRestock =
          Math.max(
            averageDemand * 2 -
            item.quantity,
            10
          );

        return {

          productName:
            item.productName,

          currentStock:
            item.quantity,

          soldUnits:
            totalSold,

          averageDemand,

          recommendedRestock,

          urgency:
            item.quantity <= 2
              ? "HIGH"
              : item.quantity <= 5
              ? "MEDIUM"
              : "LOW",

          aiReason:
            item.quantity <= 2
              ? "Critical inventory level detected based on sales velocity."
              : "AI recommends replenishment based on current demand trend.",
        };
      });

    // PROCUREMENT AI
    if (
      procurementRecommendations.length > 0
    ) {

      insights.push({

        type: "warning",

        title:
          "AI Procurement Planning",

        message:
          `${procurementRecommendations.length} products require intelligent restocking based on demand forecasting.`,
      });
    }

// AI EXECUTIVE SUMMARY
const executiveSummary = `

Business currently has
${employees.length} employees,
${inventory.length} products,
₹${revenue} revenue and
₹${expenses} expenses.

AI detected
${lowStock.length} low stock products
with estimated profit of
₹${estimatedProfit}.
`;


// AI SMART NOTIFICATIONS
const smartNotifications = [];

// LOW STOCK
if (lowStock.length > 0) {

  smartNotifications.push({

    title:
      "Low Stock Alert",

    type:
      "warning",

    message:
      `${lowStock.length} products need urgent restocking.`,
  });
}

// HIGH REVENUE
if (revenue > 100000) {

  smartNotifications.push({

    title:
      "Revenue Achievement",

    type:
      "success",

    message:
      "Business revenue crossed enterprise growth target.",
  });
}

// HIGH EXPENSES
if (expenses > revenue * 0.7) {

  smartNotifications.push({

    title:
      "Expense Monitoring",

    type:
      "danger",

    message:
      "AI detected increasing operational expenses.",
  });
}

// AI BUSINESS SCORE
let businessScore = 100;

// EXPENSE IMPACT
if (expenses > revenue * 0.7) {

  businessScore -= 25;
}

// LOW STOCK IMPACT
if (lowStock.length > 3) {

  businessScore -= 20;
}

// LOW REVENUE IMPACT
if (revenue < 50000) {

  businessScore -= 20;
}

// SMALL WORKFORCE
if (employees.length < 3) {

  businessScore -= 10;
}

businessScore =
  Math.max(
    businessScore,
    0
  );


  // AI PERFORMANCE STATUS
let businessStatus =
  "Excellent";

if (businessScore < 80) {

  businessStatus =
    "Good";
}

if (businessScore < 60) {

  businessStatus =
    "Average";
}

if (businessScore < 40) {

  businessStatus =
    "Critical";
}

    return {

      profit:
        estimatedProfit,

      revenue,

      expenses,

      lowStockCount:
        lowStock.length,

      totalSales:
        sales.length,

      insights,

      procurementRecommendations,

      businessHealth,
      predictions,

      financialInsights,

      hrInsights,

      riskAlerts,

      executiveSummary,

      smartNotifications,

      businessScore,

      businessStatus,
    };
  }
}