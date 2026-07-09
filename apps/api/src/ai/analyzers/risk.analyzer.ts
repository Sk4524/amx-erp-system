export function riskAnalyzer(data: {
  revenue: number;
  expense: number;
  inventory: any[];
  employees: any[];
}) {

  const {
    revenue,
    expense,
    inventory,
    employees,
  } = data;

  const lowStock =
    inventory.filter(
      item => item.quantity <= 5
    ).length;

  const outOfStock =
    inventory.filter(
      item => item.quantity === 0
    ).length;

  let score = 100;

  const risks = [];

  // Revenue Risk
  if (revenue < 50000) {

    score -= 20;

    risks.push({

      level: "MEDIUM",

      title: "Revenue Risk",

      message:
        "Business revenue is below the recommended threshold.",

    });

  }

  // Expense Risk
  if (
    revenue > 0 &&
    expense > revenue * 0.8
  ) {

    score -= 25;

    risks.push({

      level: "HIGH",

      title: "Expense Risk",

      message:
        "Operational expenses are consuming most of the revenue.",

    });

  }

  // Inventory Risk
  if (lowStock > 3) {

    score -= 20;

    risks.push({

      level: "HIGH",

      title: "Inventory Risk",

      message:
        `${lowStock} products require immediate restocking.`,

    });

  }

  // Out of Stock
  if (outOfStock > 0) {

    score -= 15;

    risks.push({

      level: "HIGH",

      title: "Out of Stock",

      message:
        `${outOfStock} products are completely out of stock.`,

    });

  }

  // Workforce Risk
  if (employees.length < 3) {

    score -= 10;

    risks.push({

      level: "LOW",

      title: "HR Risk",

      message:
        "Current workforce may be insufficient for future growth.",

    });

  }

  score =
    Math.max(score, 0);

  let overallRisk =
    "LOW";

  if (score < 80) {

    overallRisk =
      "MEDIUM";

  }

  if (score < 60) {

    overallRisk =
      "HIGH";

  }

  if (score < 40) {

    overallRisk =
      "CRITICAL";

  }

  return {

    businessScore:
      score,

    overallRisk,

    risks,

  };

}