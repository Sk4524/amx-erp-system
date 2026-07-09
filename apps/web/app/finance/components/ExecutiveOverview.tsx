"use client";

import {
  Wallet,
  FileText,
} from "lucide-react";

interface Props {
  income: number;
  expense: number;
  payables: number;
  receivables: number;
}

export default function ExecutiveOverview({

  income,
  expense,
  payables,
  receivables,

}: Props) {

  const profit = income - expense;

  const health =
    income === 0
      ? 0
      : Math.min(
        100,
        Math.round((profit / income) * 100 + 60)
      );

  return (

    <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-[0_20px_60px_rgba(15,23,42,.45)] border border-slate-700/40 mb-10">

      {/* Top Border */}

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500" />

      {/* Glow */}

      <div className="absolute -top-36 -left-24 w-[420px] h-[420px] rounded-full bg-cyan-500/15 blur-3xl" />

      <div className="absolute -bottom-36 -right-24 w-[420px] h-[420px] rounded-full bg-violet-500/15 blur-3xl" />

      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-cyan-400/[0.02]" />

      <div className="relative z-10 p-8 xl:p-10">

        <div className="flex flex-col xl:flex-row justify-between gap-10">

          {/* LEFT */}

          <div className="max-w-3xl">

            <p className="uppercase tracking-[0.30em] text-cyan-300 text-xs font-bold">

              EXECUTIVE FINANCIAL SUMMARY

            </p>

            <h2 className="text-4xl xl:text-5xl font-black mt-4 leading-tight">

              Enterprise Finance Health

            </h2>

            <p className="text-slate-300 mt-5 text-lg leading-8">

              Monitor overall business profitability, cash position,
              liabilities and receivables from one executive financial overview.

            </p>

            <div className="flex flex-wrap gap-3 mt-8">

              <div className="bg-emerald-500/10 border border-emerald-400/25 backdrop-blur-xl rounded-full px-5 py-2 font-medium">

                🟢 Cash Flow Healthy

              </div>

              <div className="bg-cyan-500/10 border border-cyan-400/25 backdrop-blur-xl rounded-full px-5 py-2 font-medium">

                AI Finance Ready

              </div>

              <div className="bg-violet-500/10 border border-violet-400/25 backdrop-blur-xl rounded-full px-5 py-2 font-medium">

                Real-Time Ledger

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="bg-white/5 backdrop-blur-2xl rounded-[32px] border border-white/10 p-8 min-w-[320px] shadow-xl">

            <p className="text-slate-300">

              Financial Health Score

            </p>

            <h2 className="text-6xl font-black mt-3">

              {health}

            </h2>

            <div className="w-full h-3 rounded-full bg-slate-700 overflow-hidden mt-6">

              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 shadow-[0_0_20px_rgba(56,189,248,.8)]"
                style={{
                  width: `${health}%`,
                }}
              />

            </div>

            <p className="text-slate-300 mt-5 leading-7">

              Based on profitability and enterprise cash performance.

            </p>

          </div>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-2 gap-6 mt-10">

          <div className="rounded-[30px] bg-white/5 backdrop-blur-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-xl">

              <Wallet size={30} />

            </div>

            <p className="text-slate-300 text-sm mt-6">

              Net Profit

            </p>

            <h3 className="text-3xl font-black mt-2">

              ₹{profit.toLocaleString()}

            </h3>

          </div>

          <div className="rounded-[30px] bg-white/5 backdrop-blur-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-xl">

              <FileText size={30} />

            </div>

            <p className="text-slate-300 text-sm mt-6">

              Pending Bills

            </p>

            <h3 className="text-3xl font-black mt-2">

              {payables}

            </h3>

          </div>

        </div>

      </div>

    </div>

  );

}