import { Test } from "@nestjs/testing";

import { INestApplication } from "@nestjs/common";

const request = require("supertest");

import { AppModule } from "../src/app.module";

jest.setTimeout(30000);

describe(
  "AMX ERP API (e2e)",
  () => {

    let app: INestApplication;

    beforeAll(
      async () => {

        const moduleFixture =
          await Test.createTestingModule({

            imports: [
              AppModule,
            ],

          }).compile();

        app =
          moduleFixture.createNestApplication();

        await app.init();
      }
    );

    it(
      "Health endpoint should exist",
      async () => {

        await request(
          app.getHttpServer()
        )
         .get("/health/live")
.expect(200);


      }
    );
    it(
  "Health ready endpoint should exist",
  async () => {

    await request(
      app.getHttpServer()
    )
      .get("/health/ready")
      .expect(200);
  }
);

    afterAll(
      async () => {

        await app.close();
      }
    );
  }
);