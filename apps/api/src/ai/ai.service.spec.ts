import { Test } from "@nestjs/testing";

import { AIService } from "./ai.service";
import { PrismaService } from "../prisma/prisma.service";

describe("AIService", () => {

  let service: AIService;

  const mockPrisma = {

    inventory: {
      findMany: jest.fn(),
    },

    salesOrder: {
      findMany: jest.fn(),
    },

    employee: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {

    const module = await Test.createTestingModule({

      providers: [

        AIService,

        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service =
      module.get(AIService);
  });

  it("should be defined", () => {

    expect(service)
      .toBeDefined();
  });

});