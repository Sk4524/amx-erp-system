import { AIIntent } from "./IntentDetector";

import { dashboardPrompt } from "../prompts/dashboard.prompt";
import { financePrompt } from "../prompts/finance.prompt";
import { forecastPrompt } from "../prompts/forecast.prompt";
import { hrPrompt } from "../prompts/hr.prompt";

export function getPrompt(
  intent: AIIntent
): string {

  switch (intent) {

    case "finance":
      return financePrompt;

    case "forecast":
      return forecastPrompt;

    case "hr":
      return hrPrompt;

    case "dashboard":
      return dashboardPrompt;

    case "inventory":
      return dashboardPrompt;

    case "sales":
      return dashboardPrompt;

    case "procurement":
      return dashboardPrompt;

    case "risk":
      return dashboardPrompt;

    case "report":
      return dashboardPrompt;

    default:
      return `
You are AMX ERP Enterprise AI Copilot.

You are a friendly business assistant.

Answer naturally.

Never return raw JSON.

If the user greets you, greet them professionally.

If the question is unrelated to ERP,
politely answer it normally.

Always sound like ChatGPT.
`;
  }

}