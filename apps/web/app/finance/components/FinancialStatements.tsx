"use client";

import {
  TrendingUp,
  TrendingDown,
  BadgePercent,
} from "lucide-react";

interface Props {
  income: number;
  expense: number;

  trialBalance: any[];

  profitLoss: any;

  balanceSheet: any;

  cashFlow: any;
}

export default function FinancialStatements({
  income,
  expense,

  trialBalance,

  profitLoss,

  balanceSheet,

  cashFlow,
}: Props) {

  const profit =
    profitLoss?.grossProfit ??
    (income - expense);

  const margin =
    profitLoss?.profitMargin ??
    (
      income === 0
        ? 0
        : (profit / income) * 100
    );

  const positive = profit >= 0;
  const healthScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        margin > 0
          ? Math.min(margin, 100)
          : 0
      )
    )
  );

  return (

    <div className="relative overflow-hidden rounded-[34px] bg-white/80 backdrop-blur-2xl border border-white/50 shadow-[0_10px_35px_rgba(0,0,0,.06)]">

      {/* Premium Border */}

      <div className={`absolute top-0 left-0 w-full h-1 ${positive
        ? "bg-gradient-to-r from-emerald-500 via-green-500 to-cyan-400"
        : "bg-gradient-to-r from-red-500 via-orange-500 to-rose-500"
        }`} />

      {/* Glow */}

      <div className={`absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl ${positive
        ? "bg-emerald-400/15"
        : "bg-red-400/15"
        }`} />

      <div className="relative p-8">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div>

            <p className="uppercase tracking-[0.30em] text-xs font-bold text-slate-500">

              PROFIT & LOSS

            </p>

            <h2 className="text-3xl font-black text-slate-900 mt-2">

              Executive Summary

            </h2>

          </div>

          <div
            className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-xl ${positive
              ? "bg-gradient-to-br from-emerald-500 to-green-500"
              : "bg-gradient-to-br from-red-500 to-orange-500"
              }`}
          >

            {positive ? (
              <TrendingUp size={30} />
            ) : (
              <TrendingDown size={30} />
            )}

          </div>

        </div>

        {/* Profit */}

        <div className="mt-10 grid md:grid-cols-3 gap-5">

          <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-6">

            <p className="text-sm text-slate-500">
              Net Profit
            </p>

            <h2
              className={`mt-3 text-4xl font-black ${positive
                ? "text-emerald-600"
                : "text-red-600"
                }`}
            >
              ₹{profit.toLocaleString()}
            </h2>

          </div>

          <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-6">

            <p className="text-sm text-slate-500">
              Profit Margin
            </p>

            <h2 className="mt-3 text-4xl font-black text-blue-600">

              {margin.toFixed(2)}%

            </h2>

          </div>

          <div className="rounded-3xl bg-gradient-to-br from-violet-50 to-white border border-violet-100 p-6">

            <p className="text-sm text-slate-500">
              Net Cash Flow
            </p>

            <h2 className="mt-3 text-4xl font-black text-violet-600">

              ₹{cashFlow?.netCashFlow?.toLocaleString?.() ?? 0}

            </h2>

          </div>

        </div>

        {/* Margin */}

        <div className="mt-10">

          <div className="flex items-center justify-between mb-3">

            <div className="flex items-center gap-2">

              <BadgePercent
                className="text-blue-600"
                size={20}
              />

              <span className="font-semibold">

                Profit Margin

              </span>

            </div>

            <span
              className={`font-black text-xl ${positive
                ? "text-emerald-600"
                : "text-red-600"
                }`}
            >

              {margin.toFixed(2)}%

            </span>

          </div>

          <div className="h-3 rounded-full bg-slate-200 overflow-hidden">

            <div
              className={`h-full rounded-full transition-all duration-1000 ${positive
                ? "bg-gradient-to-r from-emerald-500 to-green-400"
                : "bg-gradient-to-r from-red-500 to-orange-500"
                }`}
              style={{
                width: `${Math.min(Math.abs(margin), 100)}%`,
              }}
            />

          </div>

        </div>
        <div className="mt-10 grid grid-cols-2 gap-5">

          <div className="rounded-3xl bg-gradient-to-br from-cyan-50 to-white border border-cyan-100 p-6 shadow-sm hover:shadow-lg transition-all">

            <p className="text-xs uppercase tracking-wider text-cyan-600 font-bold">
              Assets
            </p>

            <h3 className="mt-3 text-3xl font-black text-slate-900">
              ₹{balanceSheet?.assets?.toLocaleString?.() ?? 0}
            </h3>

          </div>

          <div className="rounded-3xl bg-gradient-to-br from-red-50 to-white border border-red-100 p-6 shadow-sm hover:shadow-lg transition-all">
            <p className="text-xs uppercase tracking-wider text-red-600 font-bold">
              Liabilities
            </p>

            <h3 className="mt-3 text-3xl font-black text-red-600">
              ₹{balanceSheet?.liabilities?.toLocaleString?.() ?? 0}
            </h3>

          </div>

          <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-6 shadow-sm hover:shadow-lg transition-all">
            <p className="text-xs uppercase tracking-wider text-emerald-600 font-bold">
              Equity
            </p>

            <h3 className="mt-3 text-3xl font-black text-emerald-600">
              ₹{balanceSheet?.equity?.toLocaleString?.() ?? 0}
            </h3>

          </div>

          <div className="rounded-3xl bg-gradient-to-br from-violet-50 to-white border border-violet-100 p-6 shadow-sm hover:shadow-lg transition-all">
            <p className="text-xs uppercase tracking-wider text-violet-600 font-bold">
              Net Cash Flow
            </p>

            <h3 className="mt-3 text-3xl font-black text-violet-600">
              ₹{cashFlow?.netCashFlow?.toLocaleString?.() ?? 0}
            </h3>

          </div>

        </div>
        <div className="mt-10">

          <div className="flex items-center justify-between mb-3">

            <span className="font-semibold text-slate-700">
              Financial Health
            </span>

            <span
              className={`font-bold ${positive
                  ? "text-emerald-600"
                  : "text-red-600"
                }`}
            >
              {healthScore}%
            </span>

          </div>

          <div className="h-3 rounded-full bg-slate-200 overflow-hidden">

            <div
              className={`h-full rounded-full transition-all duration-1000 ${positive
                  ? "bg-gradient-to-r from-emerald-500 via-green-500 to-cyan-400"
                  : "bg-gradient-to-r from-red-500 to-orange-500"
                }`}
              style={{
                width: `${healthScore}%`,
              }}
            />

          </div>

          <p className="mt-3 text-sm text-slate-500">

            {positive
              ? "Business is operating with a positive financial position."
              : "Business profitability requires attention."}

          </p>

        </div>

      </div>

    </div>

  );

}