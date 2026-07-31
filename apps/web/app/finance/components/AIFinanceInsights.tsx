"use client";

import {
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  Landmark,
  Wallet,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

interface Props {
  income: number;
  expense: number;
  payables: number;
  receivables: number;
}

export default function AIFinanceInsights({

  income,
  expense,
  payables,
  receivables,

}: Props) {

  const profit = income - expense;

  const insights = [

    {
      title: "Revenue Performance",
      value: `₹${income.toLocaleString()}`,
      message:
        income > expense
          ? "Revenue is exceeding operating expenses."
          : "Revenue needs improvement.",
      color:
        "from-emerald-500 to-green-400",
      icon: TrendingUp,
    },

    {
      title: "Expense Analysis",
      value: `₹${expense.toLocaleString()}`,
      message:
        expense > income
          ? "Expenses are higher than revenue."
          : "Expenses remain under control.",
      color:
        "from-red-500 to-orange-500",
      icon: TrendingDown,
    },

    {
      title: "Cash Position",
      value: `₹${profit.toLocaleString()}`,
      message:
        profit >= 0
          ? "Healthy liquidity maintained."
          : "Cash flow requires attention.",
      color:
        "from-cyan-500 to-blue-500",
      icon: Wallet,
    },

    {
      title: "Outstanding Bills",
      value: payables,
      message:
        "Vendor payments waiting for settlement.",
      color:
        "from-orange-500 to-amber-400",
      icon: Landmark,
    },

    {
      title: "Receivable Pipeline",
      value: receivables,
      message:
        "Expected customer collections.",
      color:
        "from-violet-500 to-fuchsia-500",
      icon: Sparkles,
    },

    {
      title: "Risk Indicator",
      value:
        payables > receivables
          ? "Medium"
          : "Low",
      message:
        payables > receivables
          ? "Monitor outstanding liabilities."
          : "Financial exposure remains low.",
      color:
        "from-rose-500 to-red-500",
      icon: AlertTriangle,
    },

  ];

  return (

    <div className="relative overflow-hidden rounded-[36px] bg-white/80 backdrop-blur-2xl border border-white/50 shadow-[0_20px_60px_rgba(0,0,0,.08)] p-8 mb-10">

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500" />

      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-violet-400/10 blur-3xl" />

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8 mb-10">

        <div className="flex items-center gap-5">

          <div className="relative">

            <div className="absolute inset-0 rounded-full bg-violet-500/30 blur-2xl"></div>

            <div className="relative p-5 rounded-[30px] bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-500 text-white shadow-[0_18px_45px_rgba(124,58,237,.35)]">

              <BrainCircuit size={34} />

            </div>

          </div>

          <div>

            <p className="uppercase tracking-[0.32em] text-[11px] font-bold text-violet-600">

              AI FINANCE COPILOT

            </p>

            <h2 className="mt-2 text-[38px] font-black text-slate-900">

              Executive AI Insights

            </h2>

            <p className="mt-3 text-slate-500 max-w-2xl leading-7">

              AI continuously evaluates profitability, liquidity, receivables,
              payables and operational risk to provide executive recommendations.

            </p>

          </div>

        </div>

        <div className="rounded-[30px] bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 text-white px-8 py-6 shadow-xl">

          <p className="uppercase tracking-[0.20em] text-violet-100 text-xs">

            AI STATUS

          </p>

          <h2 className="mt-2 text-3xl font-black">

            Active

          </h2>

          <div className="mt-4 flex items-center gap-2">

            <div className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse"></div>

            <span className="text-sm">

              Real-Time Analysis

            </span>

          </div>

        </div>

      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {insights.map((item, index) => {

          const Icon = item.icon;

          return (

            <div
              key={index}
              className="group relative overflow-hidden rounded-[30px] border border-white/60 bg-gradient-to-br from-white via-slate-50/80 to-violet-50/40 p-7 shadow-[0_12px_35px_rgba(0,0,0,.05)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(124,58,237,.15)]"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.color}`} />

              <div
                className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${item.color} opacity-10 blur-3xl`}
              ></div>

              <div
                className={`relative w-16 h-16 rounded-3xl flex items-center justify-center text-white bg-gradient-to-br ${item.color} shadow-[0_15px_35px_rgba(0,0,0,.18)] group-hover:scale-110 transition-all duration-500`}
              >

                <Icon size={26} />

              </div>

              <h3 className="mt-6 text-xl font-bold">

                {item.title}

              </h3>

              <h2 className="mt-4 text-[38px] leading-none font-black text-slate-900">

                {item.value}

              </h2>

              <p className="mt-4 text-slate-500 leading-7">

                {item.message}

              </p>

              <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-4">

                <p className="uppercase tracking-[0.18em] text-[10px] font-bold text-violet-600">

                  AI Recommendation

                </p>

                <p className="mt-2 text-sm text-slate-600 leading-6">

                  {profit >= 0
                    ? "Financial indicators are stable. Continue monitoring trends and maintain positive cash flow."
                    : "Review operational costs and improve revenue generation to strengthen financial health."}

                </p>

              </div>

              <div className="mt-5 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>

                  <span className="text-xs font-semibold text-slate-500">

                    AI Confidence 98%

                  </span>

                </div>

                <div
                  className={`rounded-full px-3 py-1 text-xs font-bold ${profit >= 0
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                    }`}
                >

                  {profit >= 0 ? "Normal Priority" : "High Priority"}

                </div>

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

}