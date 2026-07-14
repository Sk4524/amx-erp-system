"use client";

import ChatHeader from "./ChatHeader";
import Conversation from "./Conversation";
import type { ChatMessage } from "./types/chat";
import SuggestionCards from "./SuggestionCards";
import QuickActions from "./QuickActions";
import ChatInput from "./ChatInput";

interface QuickAction {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface AIWindowProps {
  title?: string;
  messages: ChatMessage[];
  loading?: boolean;

  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onVoiceInput: () => void;

  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;

  quickActions?: QuickAction[];

  onClose?: () => void;
}

export default function AIWindow({
  title = "AMX AI Copilot",
  messages,
  loading = false,

  inputValue,
  onInputChange,
  onSend,
  onVoiceInput,

  suggestions = [],
  onSuggestionClick = () => {},

  quickActions = [],

  onClose,
}: AIWindowProps) {
  return (
    <div className="flex h-full flex-col rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-2xl">
      <ChatHeader {...({ title, onClose } as any)} />

      <Conversation
        messages={messages}
        loading={loading}
      />

     <SuggestionCards
  suggestions={suggestions}
  onSelect={onSuggestionClick}
/>

<ChatInput
  value={inputValue}
  loading={loading}
  onChange={onInputChange}
  onSend={onSend}
  onVoiceInput={onVoiceInput}
/>

<QuickActions actions={quickActions} />
    </div>
  );
}