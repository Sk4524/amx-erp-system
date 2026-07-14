"use client";

import { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";
import TypingAnimation from "./TypingAnimation";

import type { ChatMessage } from "./types/chat";

interface ConversationProps {
  messages: ChatMessage[];
  loading?: boolean;
}

export default function Conversation({
  messages,
  loading = false,
}: ConversationProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  bottomRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages, loading]);
  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100 scroll-smooth">
      {loading && <TypingAnimation />}

            {messages.map((msg, index) => (
        <ChatBubble
          key={index}
          role={msg.role === "user" ? "user" : "assistant"}
          message={msg.text}
          time={new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
}