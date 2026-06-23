import {
  Body,
  Controller,
  Headers,
  Post,
} from "@nestjs/common";

import { AIService }
from "./ai.service";

@Controller("ai")

export class AIController {

  constructor(

    private aiService:
    AIService

  ) {}

  @Post("chat")

  async chat(

    @Body()
    body: any,

    @Headers("tenantid")
    tenantId: string

  ) {

    return this.aiService.chat(

      body.message,

      tenantId
    );
  }
}