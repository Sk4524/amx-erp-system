"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface Props {
  income: number;
  expense: number;
  payables: number;
  receivables: number;
}

export default function FinanceCharts({
  income,
  expense,
  payables,
  receivables,
}: Props) {

  const financeData = [
    {
      name: "Income",
      amount: income,
    },
    {
      name: "Expense",
      amount: expense,
    },
  ];

  const cashFlowData = [
    {
      name: "Payables",
      value: payables,
    },
    {
      name: "Receivables",
      value: receivables,
    },
  ];

  const COLORS = [
    "#f97316",
    "#2563eb",
  ];

  return (

    <div className="grid xl:grid-cols-2 gap-7 mb-8">

      {/* REVENUE */}

      <div className="relative overflow-hidden bg-white/80 backdrop-blur-2xl rounded-[34px] border border-white/50 shadow-[0_10px_35px_rgba(0,0,0,.06)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">

        {/* TOP BORDER */}

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-cyan-400" />

        {/* GLOW */}

        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-emerald-400/20 blur-3xl" />

        <div className="relative p-7">

          <div className="mb-7">

            <p className="uppercase tracking-[0.30em] text-emerald-600 text-xs font-bold">

              FINANCIAL ANALYTICS

            </p>

            <h2 className="mt-2 text-[30px] font-black text-slate-900">

              Revenue vs Expenses

            </h2>

            <p className="text-gray-500 mt-2">

              Monthly financial comparison overview.

            </p>

          </div>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <BarChart data={financeData}>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip
                cursor={{
                  fill: "#f8fafc",
                }}
                contentStyle={{
                  borderRadius: "20px",
                  border: "1px solid #e5e7eb",
                  background: "rgba(255,255,255,.95)",
                  boxShadow:
                    "0 15px 40px rgba(0,0,0,.08)",
                }}
              />

              <Bar
                dataKey="amount"
                radius={[14,14,0,0]}
                fill="#16a34a"
                animationDuration={1400}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* CASH FLOW */}

      <div className="relative overflow-hidden bg-white/80 backdrop-blur-2xl rounded-[34px] border border-white/50 shadow-[0_10px_35px_rgba(0,0,0,.06)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400" />

        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-orange-300/20 blur-3xl" />

        <div className="relative p-7">

          <div className="mb-7">

            <p className="uppercase tracking-[0.30em] text-orange-600 text-xs font-bold">

              CASH FLOW

            </p>

            <h2 className="mt-2 text-[30px] font-black text-slate-900">

              Payables vs Receivables

            </h2>

            <p className="text-gray-500 mt-2">

              Outstanding liabilities and collections.

            </p>

          </div>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <PieChart>

              <Legend />

              <Pie
                data={cashFlowData}
                dataKey="value"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={5}
                animationDuration={1500}
              >

                {cashFlowData.map((_, index)=>(

                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />

                ))}

              </Pie>

              <Tooltip
                contentStyle={{
                  borderRadius: "20px",
                  border: "1px solid #e5e7eb",
                  background: "rgba(255,255,255,.95)",
                  boxShadow:
                    "0 15px 40px rgba(0,0,0,.08)",
                }}
              />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );

}