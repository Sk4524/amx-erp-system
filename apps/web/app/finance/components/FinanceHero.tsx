"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Landmark,
  Search,
  Sparkles,
  Download,
  Activity,
  RefreshCw,
} from "lucide-react";


interface FinanceHeroProps {
  search: string;
  setSearch: (value: string) => void;

  income: number;
  expense: number;
  profit: number;

  payables: number;
  receivables: number;
  lastUpdated: Date;
  onRefresh: () => void;
  refreshing: boolean;

  onExportPDF: () => void;
  onExportExcel: () => void;
}

export default function FinanceHero({
  search,
  setSearch,

  income,
  expense,
  profit,
  payables,
  receivables,
  lastUpdated,
  onExportPDF,
  onExportExcel,
  onRefresh,
  refreshing,
}: FinanceHeroProps) {

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });



  return (

    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: .45,
      }}
      className="relative overflow-hidden bg-white/75 backdrop-blur-2xl border border-white/50 shadow-[0_20px_70px_rgba(0,0,0,0.08)] rounded-[36px] p-7 mb-8"
    >

      {/* TOP BORDER */}

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500" />

      {/* GLOW */}

      <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl" />

      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col xl:flex-row justify-between gap-8">

        {/* LEFT */}

        <div className="flex-1">

          <div className="flex items-start gap-5">

            {/* ICON */}

            <div className="relative">

              <div className="absolute inset-0 bg-emerald-500/30 blur-2xl rounded-full" />

              <div className="relative bg-gradient-to-br from-emerald-600 via-green-500 to-cyan-500 text-white p-5 rounded-[30px] shadow-[0_15px_40px_rgba(16,185,129,.35)]">

                <Landmark size={34} />

              </div>

            </div>

            {/* TEXT */}

            <div>

              <p className="uppercase tracking-[0.30em] text-emerald-600 text-xs font-bold">

                Enterprise ERP

              </p>

              <h1 className="mt-2 text-[52px] leading-none font-black text-slate-900">

                Financial Command Center

              </h1>

              <p className="mt-5 text-gray-600 max-w-3xl leading-8 text-[16px]">

                Unified financial intelligence for revenue,
                cash flow, payables, receivables,
                ledger management and executive analytics.

              </p>

            </div>

          </div>

          {/* STATUS */}

          <div className="flex flex-wrap gap-3 mt-8">

            <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-2xl border border-emerald-200 font-semibold">

              <Activity size={15} />

              Connected

            </div>

            <div className="flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-2xl border border-cyan-200 font-semibold">

              <Sparkles size={15} />

              AI Enabled

            </div>

            <div className="bg-violet-100 text-violet-700 px-4 py-2 rounded-2xl border border-violet-200 font-semibold">

              Executive Analytics

            </div>

          </div>

          <div className="mt-8 flex flex-wrap items-center gap-8">

            <div>

              <p className="text-sm text-slate-500">

                Last Updated

              </p>

              <h3 className="mt-1 font-bold text-slate-900">

                {lastUpdated.toLocaleDateString("en-IN")} ·{" "}
                {lastUpdated.toLocaleTimeString("en-IN")}

              </h3>

            </div>

            <div className="flex items-center gap-2">

              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />

              <span className="font-semibold text-emerald-700">

                Finance Services Online

              </span>

            </div>

          </div>


        </div>

        {/* RIGHT */}

        <div className="w-full xl:w-[390px]">

          <div className="rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-7 shadow-2xl">

            <p className="uppercase tracking-[0.25em] text-cyan-300 text-xs font-bold">

              Executive Workspace

            </p>

            <h3 className="mt-4 text-2xl font-bold">

              {today}

            </h3>

            <div className="grid grid-cols-2 gap-3 mt-7">

              <div className="rounded-2xl bg-white/10 p-4">

                <p className="text-xs text-gray-300">

                  Payables

                </p>

                <h4 className="mt-2 text-xl font-bold">

                  {payables}

                </h4>

              </div>

              <div className="rounded-2xl bg-white/10 p-4">

                <p className="text-xs text-gray-300">

                  Receivables

                </p>

                <h4 className="mt-2 text-xl font-bold">

                  {receivables}

                </h4>

              </div>

            </div>

            {/* SEARCH */}

            <div className="relative mt-7">

              <Search
                size={18}
                className="absolute left-4 top-4 text-gray-400"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search transactions..."
                className="w-full rounded-2xl bg-white/10 border border-white/10 py-4 pl-11 pr-4 outline-none placeholder:text-gray-400"
              />

            </div>

            {/* BUTTONS */}

            <button className="mt-5 w-full rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-cyan-500 py-4 font-bold hover:scale-[1.02] transition-all flex justify-center items-center gap-2">

              <Search size={18} />

              Search Transactions

            </button>

            <div className="grid grid-cols-1 gap-3 mt-3">

              <button
                onClick={onRefresh}
                className="rounded-2xl bg-white/10 hover:bg-white/20 py-4 transition-all duration-300 flex justify-center items-center gap-2"
              >
                <RefreshCw
                  size={17}
                  className={refreshing ? "animate-spin" : ""}
                />

                {refreshing ? "Refreshing..." : "Refresh Data"}

              </button>

              <div className="grid grid-cols-2 gap-3">

                <button
                  onClick={onExportPDF}
                  className="rounded-2xl bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 py-4 transition-all duration-300 flex justify-center items-center gap-2"
                >
                  <Download size={17} />

                  PDF

                </button>

                <button
                  onClick={onExportExcel}
                  className="rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 py-4 transition-all duration-300 flex justify-center items-center gap-2"
                >
                  <Download size={17} />

                  Excel

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </motion.div >

  );

}