import { Injectable } from "@nestjs/common";

import Groq from "groq-sdk";

import { PrismaService } from "../../prisma/prisma.service";

import { dashboardAIPrompt } from "../prompts/dashboard-ai.prompt";

import { buildDashboardContext } from "../context/dashboard.context";

import { cleanAIJSON } from "../utils/clean-json";

import { defaultDashboardAI } from "../utils/default-dashboard";
import { DashboardAIResponse }
from "../types/dashboard";
import {

  getCache,

  setCache,

} from "../utils/ai-cache";

@Injectable()

export class DashboardAIService {

  private groq = new Groq({

    apiKey:

      process.env.GROQ_API_KEY,

  });

  constructor(

    private prisma: PrismaService

  ) {}
async generateDashboardAI(
  tenantId: string
) {

  const cacheKey =
    `dashboard-${tenantId}`;

  // CHECK CACHE
  const cached =
    getCache(cacheKey);

  if (cached) {

    return cached;
  }

  // BUILD ERP CONTEXT
  const dashboardData =
    await buildDashboardContext(

      this.prisma,

      tenantId

    );

const aiContext = {

employees: dashboardData.employeeCount,

  revenue: dashboardData.revenue,

  expense: dashboardData.expense,

  profit: dashboardData.profit,

  expenseRatio: dashboardData.expenseRatio,

  inventoryValue: dashboardData.inventoryValue,

  averageStock: dashboardData.averageStock,

  salesVolume: dashboardData.salesVolume,

  lowStock: dashboardData.lowStock.length,

  totalSalary: dashboardData.totalSalary,

  averageSalary: dashboardData.averageSalary,

 topProducts: dashboardData.topProducts,
 criticalProducts: dashboardData.criticalProducts,

latestSales: dashboardData.latestSales,
  latestTransactions: dashboardData.latestTransactions
    .slice(0, 5)
    .map(t => ({
      type: t.type,
      amount: t.amount,
    })),

};

const context = JSON.stringify(aiContext);

  try {

    console.log("========== DEBUG ==========");

console.log("System Prompt Length:", dashboardAIPrompt.length);

console.log("Context Length:", context.length);

console.log("Total Length:", dashboardAIPrompt.length + context.length);

console.log("Context Preview:");

console.log(context.substring(0, 1000));

console.log("========== END DEBUG ==========");

const completion =
  await this.groq.chat.completions.create({
        
        model:
          "llama-3.3-70b-versatile",

        messages: [

          {

            role: "system",

            content:
              dashboardAIPrompt,

          },

          {

            role: "user",

            content:
              context,

          },

        ],

      });
      

    const response =

      completion
        .choices[0]
        ?.message
        ?.content ||

      "";

    const aiData =
      cleanAIJSON(response);

    if (!aiData) {

      return defaultDashboardAI;

    }

   setCache(
  cacheKey,
  aiData,
  120000
);

    return aiData;

  }

  catch (err) {

    console.log(

      "Dashboard AI Error",

      err

    );

    return defaultDashboardAI;

  }

}
}