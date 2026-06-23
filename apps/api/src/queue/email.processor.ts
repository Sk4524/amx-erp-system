import {
  Processor,
  WorkerHost,
} from "@nestjs/bullmq";

import { Job }
from "bullmq";

import { EmailService }
from "../email/email.service";

@Processor("emailQueue")
export class EmailProcessor
extends WorkerHost {

  constructor(
    private emailService:
    EmailService
  ) {

    super();
  }

  async process(
    job: Job<any>
  ) {

   const {

  to,

  subject,

  text,

  attachments,

} = job.data;

    await this.emailService.sendEmail(

      to,

      subject,

      text,
      job.data.attachments
      
    );

    console.log(

      "Email Sent:",

      to
    );

    return true;
  }
}