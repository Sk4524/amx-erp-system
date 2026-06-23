import {
  Controller,
  Get,
  Req,
  UseGuards,
  Headers,
} from "@nestjs/common";

import { JwtAuthGuard }
from "../auth/jwt.guard";
import { AnalyticsService } from "./analytics.service";
import { AIInsightsService }
from "./ai-insights.service";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("analytics")
export class AnalyticsController {

 constructor(

  private analyticsService:
  AnalyticsService,

  private aiInsightsService:
  AIInsightsService

) {}

  // DASHBOARD
 @Get("dashboard")
 @Roles(
  "ADMIN",
  "HR",
  "FINANCE",
  "SALES",
  "EMPLOYEE",
  "MANAGER"
)
async getDashboard(
  @Req() req: any
)
{
  return this.analyticsService
    .getDashboardAnalytics(
      req.user.tenantId
    );
}

  // ADVANCED ANALYTICS
 @Get("advanced")
 @Roles(
  "ADMIN",
  "MANAGER",
  "FINANCE"
)
async getAdvanced(
  @Req() req: any
){

    return this.analyticsService
      .getAdvancedAnalytics(
        req.user.tenantId
      );
  }
  // AI INSIGHTS
@Get("ai-insights")
@Roles(
  "ADMIN",
  "MANAGER",
  "HR",
  "FINANCE"
)
async getAIInsights(
  @Req() req: any
){

  const data =
    await this.aiInsightsService.generateInsights(
      req.user.tenantId
    );

  return {
    success: true,
    data,
  };
  
  
}
}