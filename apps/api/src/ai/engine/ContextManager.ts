import { AIIntent } from "./IntentDetector";

export function buildContext(

    intent: AIIntent,

    dashboard: any,

    message: string

) {

    switch (intent) {

        case "finance":

            return JSON.stringify({

                question: message,

                revenue: dashboard.revenue,

                expense: dashboard.expense,

                profit: dashboard.profit,

                expenseRatio: dashboard.expenseRatio,

                latestTransactions:
                    dashboard.latestTransactions,

            });

        case "inventory":

            return JSON.stringify({

                question: message,

                inventoryValue:
                    dashboard.inventoryValue,

                averageStock:
                    dashboard.averageStock,

                lowStock:
                    dashboard.lowStock,

                topProducts:
                    dashboard.topProducts,

                criticalProducts:
                    dashboard.criticalProducts,

            });

        case "sales":

            return JSON.stringify({

                question: message,

                salesVolume:
                    dashboard.salesVolume,

                latestSales:
                    dashboard.latestSales,

            });

        case "hr":

            return JSON.stringify({

                question: message,

                employeeCount:
                    dashboard.employeeCount,

                totalSalary:
                    dashboard.totalSalary,

                averageSalary:
                    dashboard.averageSalary,

            });

        case "forecast":

            return JSON.stringify({

                question: message,

                revenue:
                    dashboard.revenue,

                salesVolume:
                    dashboard.salesVolume,

                inventoryValue:
                    dashboard.inventoryValue,

                expense:
                    dashboard.expense,

            });

        default:

            return JSON.stringify({

                question: message,

                revenue:
                    dashboard.revenue,

                expense:
                    dashboard.expense,

                profit:
                    dashboard.profit,

                employeeCount:
                    dashboard.employeeCount,

                inventory:
                    dashboard.inventory.length,

                lowStock:
                    dashboard.lowStock.length,

            });

    }

}