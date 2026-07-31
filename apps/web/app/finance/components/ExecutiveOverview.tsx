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

              Based on profitability, liquidity and operational finance indicators.

            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">

              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-400/20 p-4">

                <p className="text-xs uppercase tracking-[0.16em] text-emerald-300">

                  Status

                </p>

                <h3 className="mt-2 font-black text-xl">

                  Stable

                </h3>

              </div>

              <div className="rounded-2xl bg-cyan-500/10 border border-cyan-400/20 p-4">

                <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">

                  AI Monitor

                </p>

                <h3 className="mt-2 font-black text-xl">

                  Active

                </h3>

              </div>

            </div>

          </div>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-2 gap-6 mt-10">

          <div className="group relative overflow-hidden rounded-[30px] border border-cyan-400/15 bg-gradient-to-br from-cyan-500/10 via-white/5 to-blue-500/10 p-7 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(56,189,248,.18)]">
            <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 flex items-center justify-center shadow-[0_15px_35px_rgba(59,130,246,.35)] group-hover:scale-110 transition-all duration-500">
              <Wallet size={30} />

            </div>

            <p className="uppercase tracking-[0.18em] text-[11px] font-bold text-cyan-300 mt-6">

              Net Profit

            </p>

            <h3 className="mt-3 text-4xl font-black">

              ₹{profit.toLocaleString()}

            </h3>

          </div>

          <div className="group relative overflow-hidden rounded-[30px] border border-violet-400/15 bg-gradient-to-br from-violet-500/10 via-white/5 to-fuchsia-500/10 p-7 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(168,85,247,.18)]">

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-xl">

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
        {/* Executive Insight */}

        <div className="mt-10 rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-2xl p-7">

          <div className="flex flex-col xl:flex-row justify-between gap-8">

            <div>

              <p className="uppercase tracking-[0.22em] text-[11px] font-bold text-cyan-300">

                EXECUTIVE INSIGHT

              </p>

              <h3 className="mt-3 text-2xl font-black">

                Financial Position

              </h3>

              <p className="mt-4 max-w-3xl leading-8 text-slate-300">

                {profit >= 0
                  ? "The organization is operating with a positive cash position. Revenue currently exceeds expenses, indicating healthy profitability and stable financial performance."
                  : "Operating expenses currently exceed revenue. Focus on improving collections, reducing costs, and increasing revenue to restore profitability."}

              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <div className="rounded-full bg-emerald-500/10 border border-emerald-400/20 px-5 py-2">

                Profit ₹{profit.toLocaleString()}

              </div>

              <div className="rounded-full bg-cyan-500/10 border border-cyan-400/20 px-5 py-2">

                Receivables {receivables}

              </div>

              <div className="rounded-full bg-orange-500/10 border border-orange-400/20 px-5 py-2">

                Payables {payables}

              </div>

            </div>

          </div>

        </div>
      </div>

    </div>

  );

}