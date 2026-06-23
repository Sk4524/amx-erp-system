import { Injectable }
from "@nestjs/common";

import { PrismaService }
from "../prisma/prisma.service";

import Groq
from "groq-sdk";

@Injectable()

export class AIService {

  private groq =
    new Groq({

      apiKey:
        process.env.GROQ_API_KEY,
    });

  constructor(

    private prisma:
    PrismaService

  ) {}

  async chat(

    message: string,

    tenantId: string

  ) {

    try {

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

      // REVENUE
      const revenue =
        sales.reduce(

          (sum, sale) =>

            sum +
            sale.totalAmount,

          0
        );

      // LOW STOCK
      const lowStock =
        inventory.filter(

          (i) =>
            i.quantity <= 5
        );

      // AI CONTEXT
      const topProducts =

  inventory
    .slice(0, 5)
    .map(

      (item) =>

        `${item.productName}
Stock:${item.quantity}
Price:₹${item.price}`
    )
    .join("\n");

const recentSales =

  sales
    .slice(-5)
    .map(

      (sale) =>

        `${sale.productName}
Qty:${sale.quantity}
Total:₹${sale.totalAmount}`
    )
    .join("\n");

const employeeData =

  employees
    .slice(0, 5)
    .map(

      (emp) =>

        `${emp.name}
(${emp.position})
Salary:₹${emp.salary}`
    )
    .join("\n");


    
let systemInsight = "";

if (lowStock.length > 0) {

  systemInsight +=
    `Low stock alert detected for ${lowStock.length} products. `;
}

if (revenue > 100000) {

  systemInsight +=
    `Revenue performance is strong. `;
}

if (employees.length > 20) {

  systemInsight +=
    `Workforce scaling detected. `;
}
const context = `

You are an Enterprise ERP AI Assistant.

Your role:
- Analyze ERP business data
- Provide business insights
- Help with inventory
- Help with finance
- Help with forecasting
- Help with procurement
- Help with employees
- Answer professionally

====================

ERP BUSINESS DATA

Total Employees:
${employees.length}

Total Products:
${inventory.length}

Total Revenue:
₹${revenue}

Low Stock Products:
${lowStock.length}

====================

TOP INVENTORY

${topProducts}

====================

RECENT SALES

${recentSales}

====================

EMPLOYEE OVERVIEW

${employeeData}

====================
SYSTEM INSIGHTS

${systemInsight}

====================
USER QUESTION

${message}

====================

RULES:

- Reply professionally
- Give short business insights
- Use ERP terminology
- Mention inventory risks if relevant
- Mention revenue insights if relevant
- Suggest procurement if stock is low
- Keep response clean and readable
`;

      // GROQ AI
      const completion =
        await this.groq.chat.completions.create({

         messages: [

  {
    role: "system",

    content: `
You are an Enterprise ERP AI Assistant.

Your job:
- Analyze ERP business data
- Help with inventory
- Help with finance
- Help with HR
- Help with procurement
- Give professional insights
- Keep answers concise and business focused
`,
  },

  {
    role: "user",

    content: context,
  },
],
            
  model:
  "llama-3.3-70b-versatile",
        });

      return {

        reply:

          completion
            .choices[0]
            ?.message
            ?.content ||

          "AI unavailable",
      };

    } catch (error: any) {

  console.log(
    "FULL GROQ ERROR:",
    error
  );

  return {

    reply:
      error.message ||
      "Backend AI Error",
  };
}
  }
}