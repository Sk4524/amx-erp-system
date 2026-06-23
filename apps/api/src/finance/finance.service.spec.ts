import { Test, TestingModule } from "@nestjs/testing";
import { FinanceService } from "./finance.service";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { RealtimeGateway } from "../realtime/realtime.gateway";

describe("FinanceService", () => {

  let service: FinanceService;

  beforeEach(async () => {

    const module =
      await Test.createTestingModule({

        providers: [

          FinanceService,

          {
            provide: PrismaService,
            useValue: {},
          },

          {
            provide: AuditService,
            useValue: {},
          },

          {
            provide: RealtimeGateway,
            useValue: {},
          },
        ],
      }).compile();

    service =
      module.get<FinanceService>(
        FinanceService
      );
  });

  it("should be defined", () => {

    expect(service)
      .toBeDefined();

  });

});