"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type Props = {
  monthlyRevenueData: any[];
  expenseTrendData: any[];
  isAdmin: boolean;
  isFinance: boolean;
  isManager: boolean;
};

export default function AdvancedCharts({

  monthlyRevenueData,

  expenseTrendData,

  isAdmin,

  isFinance,

  isManager,

}: Props) {

  const canView =
    isAdmin ||
    isFinance ||
    isManager;

  if (!canView) return null;

  return (

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

      {/* MONTHLY REVENUE */}

      <div className="bg-white/80 backdrop-blur-2xl rounded-[30px] p-7 shadow-lg">

        <h2 className="text-[22px] text-black font-bold mb-2">

          Monthly Revenue

        </h2>

        <p className="text-sm text-gray-500 mb-5">

          Revenue performance overview

        </p>

        <ResponsiveContainer
          width="100%"
          height={220}
        >

          <LineChart
            data={
              monthlyRevenueData.length
                ? monthlyRevenueData
                : [
                    {
                      month: "Jan",
                      revenue: 0,
                    },
                  ]
            }
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={4}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      {/* EXPENSE */}

      <div className="bg-white/80 backdrop-blur-2xl rounded-[30px] p-7 shadow-lg">

        <h2 className="text-[22px] text-black font-bold mb-2">

          Expense Trends

        </h2>

        <p className="text-sm text-gray-500 mb-5">

          Monthly spending analytics

        </p>

        <ResponsiveContainer
          width="100%"
          height={220}
        >

          <AreaChart
            data={
              expenseTrendData.length
                ? expenseTrendData
                : [
                    {
                      month: "Jan",
                      expense: 0,
                    },
                  ]
            }
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Area
              dataKey="expense"
              stroke="#ef4444"
              fill="#fecaca"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}