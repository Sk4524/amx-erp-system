import { Injectable }
from "@nestjs/common";

import { PrismaService }
from "../prisma/prisma.service";

import Groq
from "groq-sdk";
import { dashboardPrompt } from "./prompts/dashboard.prompt";


import { buildDashboardContext }
from "./context/dashboard.context";
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
private async askAI(

    systemPrompt: string,

    context: string

) {

    const completion =
      await this.groq.chat.completions.create({

        model:
          "llama-3.3-70b-versatile",

        messages: [

          {

            role: "system",

            content: systemPrompt,

          },

          {

            role: "user",

            content: context,

          },

        ],

      });

    return completion
      .choices[0]
      ?.message
      ?.content;
}


  async chat(

    message: string,

    tenantId: string

  ) {

    try {
      const dashboard =
  await buildDashboardContext(
    this.prisma,
    tenantId
  );

const context =
  JSON.stringify(
    {
      question: message,
      dashboard,
    },
    null,
    2
  );

     
      // GROQ AI
const response =
  await this.askAI(
    dashboardPrompt,
    context
  );

     return {

  reply:

    response ||

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