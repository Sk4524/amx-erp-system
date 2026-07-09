"use client";

import {
  TrendingUp,
  TrendingDown,
  BadgePercent,
} from "lucide-react";

interface Props {
  income: number;
  expense: number;
}

export default function FinancialStatements({
  income,
  expense,
}: Props) {

  const profit = income - expense;

  const margin =
    income === 0
      ? 0
      : (profit / income) * 100;

  const positive = profit >= 0;

  return (

    <div className="relative overflow-hidden rounded-[34px] bg-white/80 backdrop-blur-2xl border border-white/50 shadow-[0_10px_35px_rgba(0,0,0,.06)]">

      {/* Premium Border */}

      <div className={`absolute top-0 left-0 w-full h-1 ${
        positive
          ? "bg-gradient-to-r from-emerald-500 via-green-500 to-cyan-400"
          : "bg-gradient-to-r from-red-500 via-orange-500 to-rose-500"
      }`} />

      {/* Glow */}

      <div className={`absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl ${
        positive
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
            className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-xl ${
              positive
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

        <div className="mt-10 text-center">

          <p className="text-slate-500 text-lg">

            Net Profit

          </p>

          <h1
            className={`text-6xl font-black mt-3 ${
              positive
                ? "text-emerald-600"
                : "text-red-600"
            }`}
          >

            ₹{profit.toLocaleString()}

          </h1>

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
              className={`font-black text-xl ${
                positive
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >

              {margin.toFixed(2)}%

            </span>

          </div>

          <div className="h-3 rounded-full bg-slate-200 overflow-hidden">

            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                positive
                  ? "bg-gradient-to-r from-emerald-500 to-green-400"
                  : "bg-gradient-to-r from-red-500 to-orange-500"
              }`}
              style={{
                width: `${Math.min(Math.abs(margin),100)}%`,
              }}
            />

          </div>

        </div>

      </div>

    </div>

  );

}