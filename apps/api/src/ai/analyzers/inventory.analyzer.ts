export function inventoryAnalyzer(
  inventory: any[]
) {

  const totalProducts =
    inventory.length;

  const inventoryValue =
    inventory.reduce(
      (sum, item) =>
        sum +
        (item.price * item.quantity),
      0
    );

  const totalStock =
    inventory.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );

  const averageStock =
    totalProducts > 0
      ? Math.round(
          totalStock /
          totalProducts
        )
      : 0;

  const lowStock =
    inventory.filter(
      item => item.quantity <= 5
    );

  const outOfStock =
    inventory.filter(
      item => item.quantity === 0
    );

  const overStock =
    inventory.filter(
      item => item.quantity >= 100
    );

  const lowStockPercentage =
    totalProducts > 0
      ? Number(
          (
            (lowStock.length /
              totalProducts) *
            100
          ).toFixed(1)
        )
      : 0;

  let inventoryHealth =
    "Excellent";

  if (
    lowStockPercentage > 30
  ) {

    inventoryHealth =
      "Critical";

  } else if (
    lowStockPercentage > 15
  ) {

    inventoryHealth =
      "Warning";

  } else if (
    lowStockPercentage > 5
  ) {

    inventoryHealth =
      "Good";
  }

  return {

    totalProducts,

    inventoryValue,

    averageStock,

    totalStock,

    lowStock,

    outOfStock,

    overStock,

    lowStockPercentage,

    inventoryHealth,

  };

}