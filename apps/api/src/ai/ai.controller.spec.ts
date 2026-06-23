import { Test } from "@nestjs/testing";

import { AIController } from "./ai.controller";
import { AIService } from "./ai.service";

describe("AIController", () => {

  let controller: AIController;

  const mockAIService = {

    chat: jest.fn(),
  };

  beforeEach(async () => {

    const module =
      await Test.createTestingModule({

        controllers: [

          AIController,
        ],

        providers: [

          {
            provide: AIService,
            useValue: mockAIService,
          },
        ],
      }).compile();

    controller =
      module.get(AIController);
  });

  it("should be defined", () => {

    expect(controller)
      .toBeDefined();
  });

});