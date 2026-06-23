import {
  Controller,
  Get,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

@Controller("health")
export class HealthController {

  constructor(
    private prisma: PrismaService
  ) {}
// LIVE
  @Get("live")
  live() {

    return {
      status: "ok",
      service: "AMX ERP API",
      uptime: process.uptime(),
      timestamp: new Date(),
    };
  }

  // READY
  @Get("ready")
  ready() {

    return {
      status: "ready",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date(),
    };
     }

  // DATABASE
  @Get("db")
  async db() {

    try {

      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: "connected",
        database: "postgresql",
        timestamp: new Date(),
      };

    } catch (error) {
return {
        status: "disconnected",
        database: "postgresql",
        error,
      };
    }
  }
}