import { Injectable } from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";

import { buildDashboardContext }
from "../context/dashboard.context";

import { financePrompt }
from "../prompts/finance.prompt";

import { askGroq }
from "../helpers/groq";

import { cleanAIJSON }
from "../utils/clean-json";

@Injectable()

export class FinanceAIService {

  constructor(

    private prisma: PrismaService

  ) {}

  async analyze(

    tenantId: string

  ) {

    const context =

      await buildDashboardContext(

        this.prisma,

        tenantId

      );

    const response =

      await askGroq(

        financePrompt,

        JSON.stringify(
          context,
          null,
          2
        )

      );

    return (

      cleanAIJSON(response)

      ||

      {

        summary:

          "Finance AI unavailable."

      }

    );

  }

}