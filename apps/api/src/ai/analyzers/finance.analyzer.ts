export function financeAnalyzer(data: {
  revenue: number;
  expense: number;
}) {

  const revenue =
    data.revenue || 0;

  const expense =
    data.expense || 0;

  const profit =
    revenue - expense;

  const expenseRatio =
    revenue > 0
      ? Number(
          (
            (expense / revenue) *
            100
          ).toFixed(2)
        )
      : 0;

  const profitMargin =
    revenue > 0
      ? Number(
          (
            (profit / revenue) *
            100
          ).toFixed(2)
        )
      : 0;

  let financialHealth =
    "Excellent";

  if (
    expenseRatio > 70
  ) {

    financialHealth =
      "Critical";

  } else if (
    expenseRatio > 50
  ) {

    financialHealth =
      "Warning";

  } else if (
    expenseRatio > 30
  ) {

    financialHealth =
      "Healthy";
  }

  return {

    revenue,

    expense,

    profit,

    expenseRatio,

    profitMargin,

    financialHealth,

  };
}