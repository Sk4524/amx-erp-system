import {
  Controller,
  Get,
  Req,
  UseGuards,
} from "@nestjs/common";


import { ForecastingService }
from "./forecasting.service";

import { JwtAuthGuard }
from "../auth/jwt.guard";

import { RolesGuard }
from "../auth/roles.guard";
import { Roles }
from "../auth/roles.decorator";

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

@UseGuards(
  JwtAuthGuard,
  RolesGuard
)

@ApiTags("Forecasting")

@ApiBearerAuth()

@Controller("forecasting")
export class ForecastingController {

  constructor(
    private service:
    ForecastingService
  ) {}


@ApiOperation({
  summary:
    "AI Demand Forecasting"
})
  // GET PREDICTIONS
  @Get()
  @Roles(
  "ADMIN",
  "MANAGER"
)
  async predict(
    @Req() req: any
  ) {

    return this.service.predictDemand(
      req.user.tenantId
    );
  }
}