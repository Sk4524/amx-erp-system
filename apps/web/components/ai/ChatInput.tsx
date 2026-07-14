"use client";

import { Send, Mic } from "lucide-react";

interface ChatInputProps {
  value: string;
  loading?: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
  onVoiceInput: () => void;
}

export default function ChatInput({
  value,
  loading = false,
  onChange,
  onSend,
  onVoiceInput,
}: ChatInputProps) {
  return (
    <div className="p-4 border-t bg-white flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSend();
          }
        }}
        placeholder="Ask AI anything..."
        className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 outline-none text-black bg-gray-50 focus:ring-2 focus:ring-violet-500"
      />

      <button
        type="button"
        onClick={onVoiceInput}
        className="bg-blue-500 text-white p-3 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
      >
        <Mic size={18} />
      </button>

      <button
        type="button"
        onClick={onSend}
        disabled={loading}
        className="bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white p-3 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"
      >
        {loading ? "..." : <Send size={18} />}
      </button>
    </div>
  );
}