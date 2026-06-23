import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  health() {
    return {
      status: "OK",
      service: "AMX ERP Backend",
      version: "1.0.0"
    };
  }

}