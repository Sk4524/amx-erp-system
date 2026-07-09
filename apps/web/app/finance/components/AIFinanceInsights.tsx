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

      <div className="flex items-center gap-4 mb-8">

        <div className="p-4 rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-xl">

          <BrainCircuit size={30} />

        </div>

        <div>

          <p className="uppercase tracking-[0.28em] text-xs font-bold text-violet-600">

            AI FINANCIAL INTELLIGENCE

          </p>

          <h2 className="text-4xl font-black text-slate-900 mt-2">

            Smart Finance Insights

          </h2>

          <p className="text-slate-500 mt-2">

            AI-powered executive financial recommendations.

          </p>

        </div>

      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {insights.map((item, index) => {

          const Icon = item.icon;

          return (

            <div
              key={index}
              className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 hover:-translate-y-2 hover:shadow-xl transition-all duration-500"
            >

              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.color}`} />

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${item.color} shadow-lg`}>

                <Icon size={26} />

              </div>

              <h3 className="mt-6 text-xl font-bold">

                {item.title}

              </h3>

              <h2 className="mt-3 text-3xl font-black">

                {item.value}

              </h2>

              <p className="mt-4 text-slate-500 leading-7">

                {item.message}

              </p>

            </div>

          );

        })}

      </div>

    </div>

  );

}