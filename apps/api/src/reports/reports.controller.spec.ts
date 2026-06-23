import { Test } from "@nestjs/testing";

import { ReportGeneratorService }
from "./report-generator.service";

describe("ReportGeneratorService", () => {

  let service:
    ReportGeneratorService;

  beforeEach(async () => {

    const module =
      await Test.createTestingModule({

        providers: [

          ReportGeneratorService,
        ],
      }).compile();

    service =
      module.get(
        ReportGeneratorService
      );
  });

  it("should be defined", () => {

    expect(service)
      .toBeDefined();
  });

});