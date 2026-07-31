import { AIIntent } from "../engine/IntentDetector";

export interface AIResponse {
  intent: AIIntent;
  reply: string;
  suggestions: string[];
  confidence: number;
  metadata?: {
    source?: string;
    durationMs?: number;
  };
}