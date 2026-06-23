import { Test }
from "@nestjs/testing";

import { ForecastingController }
from "./forecasting.controller";

import { ForecastingService }
from "./forecasting.service";

describe(
  "ForecastingController",
  () => {

    let controller:
      ForecastingController;

    beforeEach(
      async () => {

        const module =
          await Test.createTestingModule({

            controllers: [

              ForecastingController,
            ],

            providers: [

              {
                provide:
                  ForecastingService,

                useValue: {
                  predictDemand:
                    jest.fn(),
                },
              },
            ],
          }).compile();

        controller =
          module.get(
            ForecastingController
          );
      }
    );

    it(
      "should be defined",
      () => {

        expect(
          controller
        ).toBeDefined();
      }
    );
  }
);