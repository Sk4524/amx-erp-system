import { Module }
from "@nestjs/common";

import {
  BullModule
} from "@nestjs/bullmq";

import { QueueService }
from "./queue.service";

import { EmailProcessor }
from "./email.processor";

import { EmailModule }
from "../email/email.module";

@Module({

  imports: [

    EmailModule,

   BullModule.forRoot({

  connection: {

    host:
      process.env.REDIS_HOST ||
      "redis",

    port:
      Number(
        process.env.REDIS_PORT
      ) || 6379,
  },
}),
    BullModule.registerQueue({

      name: "emailQueue",
    }),
  ],

  providers: [

    QueueService,

    EmailProcessor,
  ],

  exports: [
    QueueService,
  ],
})
export class QueueModule {}