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

export function detectIntent(
  message: string
): AIIntent {

  const text =
    message.toLowerCase();

  // FINANCE
  if (
    /(finance|revenue|profit|expense|income|cash|balance|transaction|payment|budget)/.test(text)
  ) {
    return "finance";
  }

  // INVENTORY
  if (
    /(inventory|stock|product|warehouse|quantity|item)/.test(text)
  ) {
    return "inventory";
  }

  // SALES
  if (
    /(sales|order|customer|invoice)/.test(text)
  ) {
    return "sales";
  }

  // HR
  if (
    /(employee|staff|salary|attendance|leave|hr)/.test(text)
  ) {
    return "hr";
  }

  // FORECAST
  if (
    /(forecast|future|prediction|predict|next month|next quarter|trend)/.test(text)
  ) {
    return "forecast";
  }

  // PROCUREMENT
  if (
    /(purchase|procurement|supplier|vendor|buy|restock)/.test(text)
  ) {
    return "procurement";
  }

  // RISK
  if (
    /(risk|danger|issue|problem|warning|critical|alert)/.test(text)
  ) {
    return "risk";
  }

  // DASHBOARD
  if (
    /(dashboard|summary|overview|business|company|status|health)/.test(text)
  ) {
    return "dashboard";
  }

  // REPORTS
  if (
    /(report|pdf|excel|download|export)/.test(text)
  ) {
    return "report";
  }

  return "general";
}