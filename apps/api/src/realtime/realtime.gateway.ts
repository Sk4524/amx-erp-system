import {
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

import { Server }
from "socket.io";

@WebSocketGateway({

  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})

export class RealtimeGateway {

  @WebSocketServer()
  server: Server;

  // GENERIC EVENT
  emitEvent(
    event: string,
    data: any
  ) {

    this.server.emit(
      event,
      data
    );
  }

  // NOTIFICATION
  sendNotification(
    data: any
  ) {

    this.server.emit(
      "notification",
      data
    );
  }

  // INVENTORY UPDATE
  inventoryUpdated(
    data: any
  ) {

    this.server.emit(
      "inventory-updated",
      data
    );
  }

  // SALES UPDATE
  salesUpdated(
    data: any
  ) {

    this.server.emit(
      "sales-updated",
      data
    );
  }

  // FINANCE UPDATE
  financeUpdated(
    data: any
  ) {

    this.server.emit(
      "finance-updated",
      data
    );
  }

  // DASHBOARD REFRESH
  dashboardRefresh() {

    this.server.emit(
      "dashboard-refresh",
      {
        timestamp:
          new Date(),
      }
    );
  }
}