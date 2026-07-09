import { Injectable } from "@nestjs/common";

import Groq from "groq-sdk";

import { PrismaService } from "../../prisma/prisma.service";

import { dashboardAIPrompt } from "../prompts/dashboard-ai.prompt";

import { buildDashboardContext } from "../context/dashboard.context";

import { cleanAIJSON } from "../utils/clean-json";

import { defaultDashboardAI } from "../utils/default-dashboard";

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

  const context =
    JSON.stringify(
      dashboardData,
      null,
      2
    );

  try {

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

      60000

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