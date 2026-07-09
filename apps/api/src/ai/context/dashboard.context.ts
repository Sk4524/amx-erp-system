import { PrismaService } from "../../prisma/prisma.service";
import { financeAnalyzer } from "../analyzers/finance.analyzer";
import { inventoryAnalyzer } from "../analyzers/inventory.analyzer";
import { salesAnalyzer } from "../analyzers/sales.analyzer";
import { hrAnalyzer } from "../analyzers/hr.analyzer";
import { procurementAnalyzer } from "../analyzers/procurement.analyzer";
import { riskAnalyzer } from "../analyzers/risk.analyzer";

export async function buildDashboardContext(

    prisma: PrismaService,

    tenantId: string

) {

    const employees =
        await prisma.employee.findMany({

            where: {
                tenantId,
            },

        });

    const inventory =
        await prisma.inventory.findMany({

            where: {
                tenantId,
            },

        });

    const sales =
        await prisma.salesOrder.findMany({

            where: {
                tenantId,
            },

        });

    const transactions =
        await prisma.transaction.findMany({

            where: {
                tenantId,
            },

        });

    const revenue =
        transactions

            .filter(
                t => t.type === "INCOME"
            )

            .reduce(

                (a, b) => a + b.amount,

                0

            );

    const expense =
        transactions

            .filter(
                t => t.type === "EXPENSE"
            )

            .reduce(

                (a, b) => a + b.amount,

                0

            );

    const finance =
  financeAnalyzer({
    revenue,
    expense,
  });

const inventoryStats =
  inventoryAnalyzer(inventory);

const salesStats =
  salesAnalyzer(sales);

const hrStats =
  hrAnalyzer(
    employees,
    revenue
  );

const procurement =
  procurementAnalyzer(
    inventory,
    sales
  );

const risk =
  riskAnalyzer({
    revenue,
    expense,
    inventory,
    employees,
  });

    const lowStock =
        inventory.filter(

            i => i.quantity <= 5

        );

 const profit =
    revenue - expense;

    const expenseRatio =
    revenue > 0
        ? Number(
            (
                (expense / revenue) * 100
            ).toFixed(2)
        )
        : 0;

const inventoryValue =
    inventory.reduce(

        (sum, item) =>

            sum +
            (item.price * item.quantity),

        0

    );

const averageStock =

    inventory.length > 0

        ? Math.round(

            inventory.reduce(

                (sum, item) =>

                    sum + item.quantity,

                0

            ) / inventory.length

        )

        : 0;

const salesVolume =

    sales.reduce(

        (sum, sale) =>

            sum + sale.quantity,

        0

    );

const totalSalary =
    employees.reduce(

        (sum, emp) =>

            sum + emp.salary,

        0

    );

const averageSalary =
    employees.length

        ? Math.round(
            totalSalary /
            employees.length
        )

        : 0;

const topProducts =

    inventory

        .sort(

            (a, b) =>

                b.quantity -
                a.quantity

        )

        .slice(0, 10);

const criticalProducts =

    inventory.filter(

        i =>

            i.quantity <=
            5

    );

const latestTransactions =
    transactions.slice(-10);

const latestSales =
    sales.slice(-10);

return {

    employees,

    inventory,

    sales,

    expense: finance.expense,

    transactions,

    revenue,

    expenseRatio: finance.expenseRatio,

    profit: finance.profit,

    lowStock:
  inventoryStats.lowStock,

    totalSalary:
  hrStats.totalSalary,

    averageSalary:
  hrStats.averageSalary,

    topProducts,

    criticalProducts:
  inventoryStats.outOfStock,

    latestTransactions,

    latestSales,

inventoryValue:
  inventoryStats.inventoryValue,

averageStock:
  inventoryStats.averageStock,

salesVolume:
  salesStats.salesVolume,

};

}