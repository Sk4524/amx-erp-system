import { Injectable }
from "@nestjs/common";

import { PrismaService }
from "../prisma/prisma.service";
import { askGroq }
from "./helpers/groq";
import { runAI } from "./engine/AIEngine";
import { runCopilot }
from "./copilot/Copilot";

import { dashboardPrompt } from "./prompts/dashboard.prompt";


import { buildDashboardContext }
from "./context/dashboard.context";
@Injectable()

export class AIService {

 
  constructor(

    private prisma:
    PrismaService

  ) {}
private async askAI(

  systemPrompt: string,

  context: string

) {

  return askGroq(

    systemPrompt,

    context

  );

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

return await runCopilot(

    tenantId,

    message,

    dashboard,

    this.askAI.bind(this)

);
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