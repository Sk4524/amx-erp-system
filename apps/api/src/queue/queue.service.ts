import { Injectable }
from "@nestjs/common";

import {
  InjectQueue
} from "@nestjs/bullmq";

import { Queue }
from "bullmq";

@Injectable()
export class QueueService {

  constructor(

    @InjectQueue("emailQueue")

    private emailQueue:
    Queue
  ) {}

  // ADD EMAIL JOB
  async addEmailJob(
    data: any
  ) {

    await this.emailQueue.add(

      "sendEmail",

      data,

      {

        attempts: 3,

        backoff: {

          type: "fixed",

          delay: 5000,
        },
      }
    );
  }
}