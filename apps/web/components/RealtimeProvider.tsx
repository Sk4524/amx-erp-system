"use client";

import {
  useEffect
} from "react";

import { io }
from "socket.io-client";

import { toast }
from "react-hot-toast";

export default function RealtimeProvider() {

  useEffect(() => {

    const socket =
  io(
    process.env
      .NEXT_PUBLIC_SOCKET_URL ||
    "http://localhost:3002"
  );
  
  socket.on(
  "notification",
  (data) => {

    console.log(
      "SOCKET NOTIFICATION:",
      data
    );

    let message = "Notification";

    if (
      typeof data === "string"
    ) {

      message = data;

    } else if (
      data?.message
    ) {

      message =
        typeof data.message ===
        "string"

          ? data.message

          : JSON.stringify(
              data.message
            );

    } else {

      message =
        JSON.stringify(data);
    }

    toast.success(
      message,
      {
        duration: 5000,
        position: "top-right",
      }
    );
  }
);

    return () => {

      socket.disconnect();
    };

  }, []);

  return null;
}