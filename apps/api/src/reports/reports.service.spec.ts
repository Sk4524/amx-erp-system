import { Test } from "@nestjs/testing";

import { ReportsService } from "./reports.service";
import { PrismaService } from "../prisma/prisma.service";
import { QueueService } from "../queue/queue.service";

describe("ReportsService", () => {

  let service: ReportsService;

  const mockPrisma = {

    report: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },

    reportHistory: {
      findMany: jest.fn(),
    },
  };

  const mockQueue = {

    addEmailJob: jest.fn(),
  };

  beforeEach(async () => {

    const module =
      await Test.createTestingModule({

        providers: [

          ReportsService,

          {
            provide: PrismaService,
            useValue: mockPrisma,
          },

          {
            provide: QueueService,
            useValue: mockQueue,
          },
        ],
      }).compile();

    service =
      module.get(ReportsService);
  });

  it("should be defined", () => {

    expect(service)
      .toBeDefined();
  });

});