import { Module }
from "@nestjs/common";

import { EventsService }
from "./events.service";

import { PrismaModule }
from "../prisma/prisma.module";

import { RealtimeModule }
from "../realtime/realtime.module";

@Module({

  imports: [

    PrismaModule,

    RealtimeModule,
  ],

  providers: [
    EventsService,
  ],

  exports: [
    EventsService,
  ],
})

export class EventsModule {}