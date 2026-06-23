import { Test, TestingModule } from "@nestjs/testing";
import { InventoryService } from "./inventory.service";
import { PrismaService } from "../prisma/prisma.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AuditService } from "../audit/audit.service";
import { RealtimeGateway } from "../realtime/realtime.gateway";
import { NotificationsService } from "../notifications/notifications.service";

describe("InventoryService", () => {

  let service: InventoryService;

  beforeEach(async () => {

    const module =
      await Test.createTestingModule({

        providers: [

          InventoryService,

          {
            provide: PrismaService,
            useValue: {},
          },

          {
            provide: EventEmitter2,
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

          {
            provide: NotificationsService,
            useValue: {},
          },
        ],
      }).compile();

    service =
      module.get<InventoryService>(
        InventoryService
      );
  });

  it("should be defined", () => {

    expect(service)
      .toBeDefined();

  });

});