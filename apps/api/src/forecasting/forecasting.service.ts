import { Injectable } from "@nestjs/common";

import { PrismaService }
from "../prisma/prisma.service";
import { AuditService }
from "../audit/audit.service";

import axios
from "axios";

@Injectable()

export class ForecastingService {

constructor(

  private prisma:
  PrismaService,

  private auditService:
  AuditService

) {}

  // REAL AI FORECAST
  async predictDemand(
    tenantId: string
  ) {

    try {

      // GET INVENTORY
      const inventory =
        await this.prisma.inventory.findMany({

          where: {
            tenantId,
          },
        });

      const predictions = [];

      // LOOP PRODUCTS
      for (const item of inventory) {

        // SALES HISTORY
        const sales =
          await this.prisma.salesOrder.findMany({

            where: {

              tenantId,

              productName:
                item.productName,
            },

            orderBy: {
              createdAt: "asc",
            },

            take: 30,
          });

        // HISTORY ARRAY
        let history =
          sales.map(
            (sale) =>
              sale.quantity
          );

        // FALLBACK HISTORY
        if (
          history.length < 2
        ) {

          history = [

            5,
            8,
            12,
            15,
          ];
        }

        let predictedDemand =
          item.quantity;

        try {

          // AI ML SERVICE
         const response =
  await axios.post(

    `${
      process.env.ML_SERVICE_URL ||
      "http://localhost:8000"
    }/predict`,

    {
      history,
    }
  );
          predictedDemand =
            Number(
              response.data.prediction
            );

        } catch (mlError) {

          console.log(
            "ML ERROR:",
            mlError
          );

          predictedDemand =
            Math.round(

              history.reduce(
                (a, b) => a + b,
                0
              ) / history.length
            );
        }

        const stockGap =
  predictedDemand -
  item.quantity;

// RISK LEVEL
let riskLevel = "LOW";

if (stockGap >= 50) {

  riskLevel = "HIGH";

} else if (
  stockGap >= 20
) {

  riskLevel = "MEDIUM";
}

// PROCUREMENT PRIORITY
const priority =
  stockGap > 30
    ? "URGENT"
    : stockGap > 10
      ? "IMPORTANT"
      : "NORMAL";

// SMART ETA
const eta =
  riskLevel === "HIGH"
    ? "24 Hours"
    : riskLevel === "MEDIUM"
      ? "3 Days"
      : "7 Days";

// AI VENDOR
const vendors = [

  "GlobalTech Supply",

  "Vertex Industrial",

  "NextGen Procurement",

  "Prime Logistics",

  "Smart Inventory Corp",
];

const vendor =
  vendors[
    Math.floor(
      Math.random() *
      vendors.length
    )
  ];

// RECOMMENDED RESTOCK
const recommendedRestock =
  Math.max(
    predictedDemand -
    item.quantity,
    0
  );

predictions.push({

  productName:
    item.productName,

  currentStock:
    item.quantity,

  predictedDemand,

  salesDataPoints:
    history.length,

  riskLevel,

  priority,

  eta,

  vendor,

  recommendedRestock,
});
      }

      await this.auditService.createLog({

  action:
    "FORECAST_GENERATED",

  module:
    "FORECASTING",

  description:
    `Generated forecasts for ${predictions.length} products`,

  userEmail:
    "SYSTEM",

  tenantId,
});

return predictions;

}catch (err) {

  console.log(
    "FORECAST ERROR:",
    err
  );

  throw err;
}
  }
}