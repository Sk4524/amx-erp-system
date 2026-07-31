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

  fromDate: string;
  toDate: string;

  setFromDate: (value: string) => void;
  setToDate: (value: string) => void;
  transactionType: string;
  setTransactionType: (value: string) => void;

  selectedAccount: string;
  setSelectedAccount: (value: string) => void;

  accounts: any[];

  minAmount: string;
  maxAmount: string;

  setMinAmount: (value: string) => void;
  setMaxAmount: (value: string) => void;

  sortBy: string;
  setSortBy: (value: string) => void;

  onResetFilters: () => void;

  income: number;
  expense: number;
  profit: number;

  payables: number;
  receivables: number;

  lastUpdated: Date;
  onSearch: () => void;
  onRefresh: () => void;
  refreshing: boolean;

  onExportPDF: () => void;
  onExportExcel: () => void;
}

export default function FinanceHero({
  search,
  setSearch,
  fromDate,
  toDate,

  setFromDate,
  setToDate,
  transactionType,
  setTransactionType,

  selectedAccount,
  setSelectedAccount,

  accounts,

  minAmount,
  maxAmount,

  setMinAmount,
  setMaxAmount,

  sortBy,
  setSortBy,

  onResetFilters,
  income,
  expense,
  profit,
  payables,
  receivables,
  lastUpdated,
  onSearch,
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

              <div className="relative bg-gradient-to-br from-emerald-600 via-green-500 to-cyan-500 text-white p-4 rounded-[30px] shadow-[0_15px_40px_rgba(16,185,129,.35)]">

                <Landmark size={28} />

              </div>

            </div>

            {/* TEXT */}

            <div>

              <p className="uppercase tracking-[0.30em] text-emerald-600 text-xs font-bold">

                Enterprise ERP

              </p>

              <h1 className="mt-2 text-[42px] xl:text-[46px] leading-tight font-black text-slate-900">

                Financial Command Center

              </h1>

              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-600">

                Enterprise finance dashboard for real-time accounting, cash flow, payables, receivables, ledger management and AI-powered executive insights.

              </p>

            </div>

          </div>

          {/* STATUS */}

          <div className="flex flex-wrap gap-3 mt-6">

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

          <div className="mt-6 flex flex-wrap items-center gap-6">

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

        <div className="w-full xl:w-[360px]">

          <div className="rounded-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 shadow-2xl">

            <p className="uppercase tracking-[0.25em] text-cyan-300 text-xs font-bold">

              Executive Workspace

            </p>

            <h3 className="mt-3 text-xl font-bold">

              {today}

            </h3>

            <div className="grid grid-cols-2 gap-3 mt-5">

              <div className="rounded-2xl bg-white/10 p-4">

                <p className="text-xs text-gray-300">

                  Payables

                </p>

                <h4 className="mt-1 text-lg font-bold">

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

            <div className="relative mt-5">

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
                className="w-full rounded-2xl bg-white/10 border border-white/10 py-4 pl-11 pr-4 outline-none text-white placeholder:text-slate-300"
              />

            </div>


            <div className="grid grid-cols-2 gap-3 mt-5">

              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="rounded-2xl bg-white/10 border border-white/10 py-3 px-4 outline-none text-white"
              />

              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="rounded-2xl bg-white/10 border border-white/10 py-3 px-4 outline-none text-white"
              />

            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">

              <select
                value={transactionType}
                onChange={(e) =>
                  setTransactionType(e.target.value)
                }
                className="rounded-2xl bg-white/10 border border-white/10 py-3 px-4 text-white"
              >
                <option value="" style={{ color: "black" }}>
                  All Types
                </option>

                <option value="INCOME" style={{ color: "black" }}>
                  Income
                </option>

                <option value="EXPENSE" style={{ color: "black" }}>
                  Expense
                </option>
              </select>

              <select
                value={selectedAccount}
                onChange={(e) =>
                  setSelectedAccount(e.target.value)
                }
                className="rounded-2xl bg-white/10 border border-white/10 py-3 px-4 text-white"
              >
                <option value="">All Accounts</option>

                {accounts.map((account: any) => (

                  <option
                    key={account.id}
                    value={account.id}
                    style={{ color: "black" }}
                  >
                    {account.name}
                  </option>

                ))}

              </select>

            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">

              <input
                type="number"
                placeholder="Min Amount"
                value={minAmount}
                onChange={(e) =>
                  setMinAmount(e.target.value)
                }
                className="rounded-2xl bg-white/10 border border-white/10 py-3 px-4 text-white placeholder:text-slate-300"
              />

              <input
                type="number"
                placeholder="Max Amount"
                value={maxAmount}
                onChange={(e) =>
                  setMaxAmount(e.target.value)
                }
                className="rounded-2xl bg-white/10 border border-white/10 py-3 px-4 text-white placeholder:text-slate-300"
              />

            </div>

            <div className="mt-3">

              <select
                value={sortBy}
                onChange={(e) =>

                  setSortBy(e.target.value)
                }
                className="w-full rounded-2xl bg-white/10 border border-white/10 py-3 px-4 text-white"
              >

                <option value="latest" style={{ color: "black" }}>
                  Latest First
                </option>

                <option value="oldest" style={{ color: "black" }}>
                  Oldest First
                </option>

                <option value="highest" style={{ color: "black" }}>
                  Highest Amount
                </option>

                <option value="lowest" style={{ color: "black" }}>
                  Lowest Amount
                </option>

              </select>

            </div>
            {/* BUTTONS */}

            <button
              onClick={onSearch}
              className="mt-5 w-full rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-cyan-500 py-4 font-bold hover:scale-[1.02] transition-all flex justify-center items-center gap-2"
            >

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

              <div className="grid grid-cols-3 gap-3">

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
                <button
                  onClick={onResetFilters}
                  className="w-full rounded-2xl border border-slate-600 bg-slate-700/40 hover:bg-slate-700/70 py-3 font-medium transition-all"
                >
                  Reset Filters
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

    </motion.div >

  );

}