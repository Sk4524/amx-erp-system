"use client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/formatCurrency";
import {
  TrendingUp,
  TrendingDown,
  Trophy,
  Wallet,
} from "lucide-react";

import { motion } from "framer-motion";
interface Props {
  income: number;
  expense: number;
  payables: number;
  receivables: number;

  monthlyAnalytics: {
    month: string;
    income: number;
    expense: number;
  }[];
}

export default function FinanceCharts({
  income,
  expense,
  payables,
  receivables,
  monthlyAnalytics,
}: Props) {

  const financeData = monthlyAnalytics.map((item) => ({
    name: item.month,
    Income: item.income,
    Expense: item.expense,
  }));

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

  const totalMonthlyIncome =
    monthlyAnalytics.reduce(
      (sum, item) => sum + item.income,
      0,
    );

  const totalMonthlyExpense =
    monthlyAnalytics.reduce(
      (sum, item) => sum + item.expense,
      0,
    );

  const bestMonth =
    monthlyAnalytics.reduce(
      (best, current) =>
        current.income > best.income
          ? current
          : best,
      monthlyAnalytics[0] || {
        month: "-",
        income: 0,
        expense: 0,
      },
    );

  const bestProfitMonth =
    monthlyAnalytics.reduce(
      (best, current) => {

        const currentProfit =
          current.income - current.expense;

        const bestProfit =
          best.income - best.expense;

        return currentProfit > bestProfit
          ? current
          : best;

      },
      monthlyAnalytics[0] || {
        month: "-",
        income: 0,
        expense: 0,
      },
    );

  return (

    <div className="grid xl:grid-cols-3 gap-7 mb-8">

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      >

        {/* TOTAL INCOME */}

        <div className="rounded-[30px] bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 text-white p-6 shadow-xl">

          <div className="flex justify-between items-start">

            <div>

              <p className="uppercase tracking-wider text-emerald-100 text-xs">
                Total Income
              </p>

              <h2 className="mt-4 text-4xl text-[30px] font-black">
                {formatCurrency(totalMonthlyIncome)}
              </h2>

            </div>

            <div className="p-3 rounded-2xl bg-white/15">
              <TrendingUp size={28} />
            </div>

          </div>

        </div>

        {/* TOTAL EXPENSE */}

        <div className="rounded-[30px] bg-gradient-to-br from-red-500 via-rose-500 to-orange-500 text-white p-6 shadow-xl">

          <div className="flex justify-between items-start">

            <div>

              <p className="uppercase tracking-wider text-red-100 text-xs">
                Total Expense
              </p>

              <h2 className="mt-4 text-4xl text-[30px] font-black">
                {formatCurrency(totalMonthlyExpense)}
              </h2>

            </div>

            <div className="p-3 rounded-2xl bg-white/15">
              <TrendingDown size={28} />
            </div>

          </div>

        </div>

        {/* BEST REVENUE */}

        <div className="rounded-[30px] bg-gradient-to-br from-blue-600 via-cyan-500 to-sky-500 text-white p-6 shadow-xl">

          <div className="flex justify-between items-start">

            <div>

              <p className="uppercase tracking-wider text-cyan-100 text-xs">
                Best Revenue
              </p>

              <h2 className="mt-4 text-3xl font-black">
                {bestMonth.month}
              </h2>

              <p className="mt-2 text-cyan-100">
                {formatCurrency(bestMonth.income)}
              </p>

            </div>

            <div className="p-3 rounded-2xl bg-white/15">
              <Trophy size={28} />
            </div>

          </div>

        </div>

        {/* BEST PROFIT */}

        <div className="rounded-[30px] bg-gradient-to-br from-violet-600 via-purple-500 to-indigo-500 text-white p-6 shadow-xl">

          <div className="flex justify-between items-start">

            <div>

              <p className="uppercase tracking-wider text-violet-100 text-xs">
                Best Profit
              </p>

              <h2 className="mt-4 text-3xl font-black">
                {bestProfitMonth.month}
              </h2>

              <p className="mt-2 text-violet-100">
                {formatCurrency(
                  bestProfitMonth.income -
                  bestProfitMonth.expense
                )}
              </p>

            </div>

            <div className="p-3 rounded-2xl bg-white/15">
              <Wallet size={28} />
            </div>

          </div>

        </div>

      </motion.div>

      {/* REVENUE */}

      <motion.div
        whileHover={{
          y: -6,
          transition: {
            duration: 0.25,
          },
        }}
        className="group relative overflow-hidden rounded-[34px] border border-white/60 bg-white/80 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,.10)] transition-all duration-300"
      >
        {/* TOP BORDER */}

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-cyan-400" />

        {/* GLOW */}

        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-emerald-400/20 blur-3xl" />

        <div className="relative p-8">

          <div className="mb-7">

            <p className="uppercase tracking-[0.32em] text-emerald-600 text-[11px] font-extrabold">

              FINANCIAL ANALYTICS

            </p>

            <h2 className="mt-2 text-3xl xl:text-[34px] leading-tight font-black text-slate-900">

              Revenue vs Expenses

            </h2>
            <div className="mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Live Analytics
            </div>
            <p className="mt-3 text-slate-500 leading-7">

              Monthly financial comparison overview.

            </p>

          </div>

          <ResponsiveContainer
            width="100%"
            height={380}
          >

            <BarChart data={financeData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />

              <XAxis dataKey="name" />

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

              <Legend />

              <Bar
                dataKey="Income"
                radius={[14, 14, 0, 0]}
                fill="#16a34a"
                animationDuration={1400}
              />

              <Bar
                dataKey="Expense"
                radius={[14, 14, 0, 0]}
                fill="#ef4444"
                animationDuration={1400}
              />
            </BarChart>

          </ResponsiveContainer>

        </div>

      </motion.div>

      {/* CASH FLOW */}

      <motion.div
        whileHover={{
          y: -6,
          transition: {
            duration: 0.25,
          },
        }}
        className="relative overflow-hidden rounded-[36px] border border-orange-100 bg-gradient-to-br  from-white via-orange-50/40 to-amber-50/40 shadow-[0_20px_60px_rgba(249,115,22,.08)]"
      >

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400" />

        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-orange-300/20 blur-3xl" />

        <div className="relative p-8">

          <div className="mb-7">

            <p className="uppercase tracking-[0.32em] text-orange-600 text-[11px] font-extrabold">

              CASH FLOW

            </p>

            <h2 className="mt-2 text-3xl xl:text-[34px] leading-tight font-black text-slate-900">

              Payables vs Receivables

            </h2>
            <div className="mt-3 inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
              Outstanding Balance
            </div>
            <p className="mt-3 text-slate-500 leading-7">

              Outstanding liabilities and collections.

            </p>


          </div>

          <ResponsiveContainer
            width="100%"
            height={360}
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

                {cashFlowData.map((_, index) => (

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

      </motion.div>

      <motion.div
        whileHover={{
          y: -6,
          transition: {
            duration: 0.25,
          },
        }}
        className="relative overflow-hidden rounded-[36px] border border-violet-100 bg-gradient-to-br from-white via-violet-50/40 to-indigo-50/40 shadow-[0_20px_60px_rgba(124,58,237,.08)]"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />

        <div className="relative p-8">

          <div className="mb-7">

            <p className="uppercase tracking-[0.32em] text-violet-600 text-[11px] font-extrabold">
              MONTHLY TREND
            </p>

            <h2 className="mt-2 text-3xl xl:text-[34px] leading-tight font-black text-slate-900">
              Income vs Expense
            </h2>
            <div className="mt-3 inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
              12 Month Trend
            </div>
          </div>

          <ResponsiveContainer
            width="100%"
            height={380}
          >
            <AreaChart data={monthlyAnalytics}>

              <defs>

                <linearGradient
                  id="incomeGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#10b981"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="#10b981"
                    stopOpacity={0}
                  />
                </linearGradient>

                <linearGradient
                  id="expenseGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#ef4444"
                    stopOpacity={0.30}
                  />
                  <stop
                    offset="95%"
                    stopColor="#ef4444"
                    stopOpacity={0}
                  />
                </linearGradient>

              </defs>

              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="#e5e7eb"
              />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "18px",
                  border: "1px solid #e5e7eb",
                  background: "rgba(255,255,255,.97)",
                }}
              />

              <Legend />

              <Area
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#incomeGradient)"
              />

              <Area
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                strokeWidth={3}
                fill="url(#expenseGradient)"
              />

            </AreaChart>
          </ResponsiveContainer>

        </div>

      </motion.div>


    </div >

  );

}