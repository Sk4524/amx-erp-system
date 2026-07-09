export function salesAnalyzer(
  sales: any[]
) {

  const totalOrders =
    sales.length;

  const salesVolume =
    sales.reduce(
      (sum, sale) =>
        sum + sale.quantity,
      0
    );

  const totalRevenue =
    sales.reduce(
      (sum, sale) =>
        sum + sale.totalAmount,
      0
    );

  const averageOrderValue =
    totalOrders > 0
      ? Number(
          (
            totalRevenue /
            totalOrders
          ).toFixed(2)
        )
      : 0;

  const topProducts: Record<string, number> = {};

  sales.forEach((sale) => {

    topProducts[sale.productName] =
      (topProducts[sale.productName] || 0)
      + sale.quantity;

  });

  const bestSellingProducts =
    Object.entries(topProducts)
      .sort(
        (a, b) =>
          b[1] - a[1]
      )
      .slice(0, 5)
      .map(([product, quantity]) => ({

        product,

        quantity,

      }));

  let salesHealth =
    "Excellent";

  if (totalOrders < 5) {

    salesHealth = "Critical";

  } else if (totalOrders < 15) {

    salesHealth = "Warning";

  } else if (totalOrders < 30) {

    salesHealth = "Good";

  }

  return {

    totalOrders,

    salesVolume,

    totalRevenue,

    averageOrderValue,

    bestSellingProducts,

    salesHealth,

  };

}