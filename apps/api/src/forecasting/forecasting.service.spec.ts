import { Test }
from "@nestjs/testing";

import { ForecastingService }
from "./forecasting.service";

import { PrismaService }
from "../prisma/prisma.service";

describe(
  "ForecastingService",
  () => {

    let service:
      ForecastingService;

    const mockPrisma = {

      inventory: {

        findMany:
          jest.fn()
      },

      salesOrder: {

        findMany:
          jest.fn()
      },
    };

    beforeEach(
      async () => {

        const module =
          await Test.createTestingModule({

            providers: [

              ForecastingService,

              {
                provide:
                  PrismaService,

                useValue:
                  mockPrisma,
              },
            ],
          }).compile();

        service =
          module.get(
            ForecastingService
          );
      }
    );

    it(
      "should be defined",
      () => {

        expect(
          service
        ).toBeDefined();
      }
    );
  }
);