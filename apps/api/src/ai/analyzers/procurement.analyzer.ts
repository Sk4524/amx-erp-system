export function procurementAnalyzer(
  inventory: any[],
  sales: any[]
) {

  const recommendations =
    inventory
      .filter(
        item => item.quantity <= 5
      )
      .map(item => {

        const productSales =
          sales.filter(
            sale =>
              sale.productName ===
              item.productName
          );

        const soldUnits =
          productSales.reduce(
            (sum, sale) =>
              sum + sale.quantity,
            0
          );

        const averageDemand =
          productSales.length > 0
            ? Math.ceil(
                soldUnits /
                productSales.length
              )
            : 10;

        const recommendedRestock =
          Math.max(
            averageDemand * 2 -
              item.quantity,
            10
          );

        let priority =
          "LOW";

        if (
          item.quantity <= 2
        ) {

          priority = "HIGH";

        } else if (
          item.quantity <= 5
        ) {

          priority = "MEDIUM";
        }

        return {

          productName:
            item.productName,

          currentStock:
            item.quantity,

          soldUnits,

          averageDemand,

          recommendedRestock,

          priority,

          estimatedCost:
            recommendedRestock *
            item.price,

        };

      });

  return {

    recommendations,

    totalRecommendations:
      recommendations.length,

  };

}