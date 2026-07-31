export type AIIntent =
  | "dashboard"
  | "finance"
  | "inventory"
  | "sales"
  | "hr"
  | "forecast"
  | "procurement"
  | "risk"
  | "report"
  | "general";

export interface IntentResult {

    intent: AIIntent;

    confidence: number;

}

export function detectIntent(
  message: string
): IntentResult {

  const text =
    message.toLowerCase();

  // FINANCE
  if (
    /(finance|revenue|profit|expense|income|cash|balance|transaction|payment|budget)/.test(text)
  ) {
   return {

intent:"finance",

confidence:0.95

};
  }

  // INVENTORY
  if (
    /(inventory|stock|product|warehouse|quantity|item)/.test(text)
  ) {
    return {

intent:"inventory",

confidence:0.95

};
  }

  // SALES
  if (
    /(sales|order|customer|invoice)/.test(text)
  ) {
    return {

intent:"sales",

confidence:0.95

};
  }

  // HR
  if (
    /(employee|staff|salary|attendance|leave|hr)/.test(text)
  ) {
    return {

intent:"hr",

confidence:0.95

};
  }

  // FORECAST
  if (
    /(forecast|future|prediction|predict|next month|next quarter|trend)/.test(text)
  ) {
    return {

intent:"forecast",

confidence:0.95

};
  }

  // PROCUREMENT
  if (
    /(purchase|procurement|supplier|vendor|buy|restock)/.test(text)
  ) {
    return {

intent:"procurement",

confidence:0.95

};
  }

  // RISK
  if (
    /(risk|danger|issue|problem|warning|critical|alert)/.test(text)
  ) {
    return {

intent:"risk",

confidence:0.95

};
  }

  // DASHBOARD
  if (
    /(dashboard|summary|overview|business|company|status|health)/.test(text)
  ) {
    return {

intent:"dashboard",

confidence:0.95

};
  }

  // REPORTS
  if (
    /(report|pdf|excel|download|export)/.test(text)
  ) {
    return {

intent:"report",

confidence:0.95

};
  }

  return {

intent:"general",

confidence:0.60

};
}