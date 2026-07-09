"use client";

import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  CircleDollarSign,
} from "lucide-react";

interface Props {

  role: string;

  amount: string;
  setAmount: (v: string) => void;

  type: string;
  setType: (v: string) => void;

  createTransaction: () => void;

}

export default function FinanceQuickActions({

  role,

  amount,
  setAmount,

  type,
  setType,

  createTransaction,

}: Props) {

  if (role !== "ADMIN") return null;

  return (

    <motion.div
      whileHover={{ y: -4 }}
      className="relative overflow-hidden bg-white/80 backdrop-blur-2xl rounded-[34px] border border-white/50 shadow-[0_10px_35px_rgba(0,0,0,.06)] "
    >

      {/* TOP BORDER */}

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-cyan-400" />

      {/* GLOW */}

      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-emerald-400/20 blur-3xl" />

      <div className="relative p-8">

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

          {/* LEFT */}

          <div className="flex items-start gap-5">

            <div className="relative">

              <div className="absolute inset-0 bg-emerald-500/30 blur-2xl rounded-full"></div>

              <div className="relative bg-gradient-to-br from-emerald-600 via-green-500 to-teal-400 text-white p-5 rounded-[28px] shadow-[0_15px_35px_rgba(16,185,129,.35)]">

                <ArrowLeftRight size={30} />

              </div>

            </div>

            <div>

              <p className="uppercase tracking-[0.30em] text-xs font-bold text-emerald-600">

                FINANCE CONTROL CENTER

              </p>

              <h2 className="text-[38px] font-black text-slate-900 mt-2">

                Quick Transactions

              </h2>

              <p className="text-slate-500 mt-3 max-w-2xl leading-7">

                Instantly record income or expenses into the ERP accounting
                system. Every transaction updates analytics, ledger,
                financial statements and AI insights automatically.

              </p>

            </div>

          </div>

          {/* RIGHT */}

          <div className="flex flex-wrap gap-3">

            <div className="px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-700 font-semibold">

              Live Accounting

            </div>

            <div className="px-4 py-2 rounded-2xl bg-cyan-100 text-cyan-700 font-semibold">

              Auto Ledger

            </div>

            <div className="px-4 py-2 rounded-2xl bg-violet-100 text-violet-700 font-semibold">

              AI Synced

            </div>

          </div>

        </div>

        {/* FORM */}

        <div className="mt-10 grid xl:grid-cols-[1.3fr_1fr_auto] gap-5">

          <div>

            <label className="text-sm font-semibold text-slate-600 mb-2 block">

              Transaction Amount

            </label>

            <input
              type="number"
              placeholder="₹ Enter Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />

          </div>

          <div>

            <label className="text-sm font-semibold text-slate-600 mb-2 block">

              Transaction Type

            </label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >

              <option value="INCOME">

                Income

              </option>

              <option value="EXPENSE">

                Expense

              </option>

            </select>

          </div>

          <div className="flex items-end">

            <button
              onClick={createTransaction}
              className="w-full xl:w-auto rounded-2xl bg-gradient-to-r from-emerald-600 via-green-500 to-teal-400 px-8 py-4 text-white font-bold shadow-[0_15px_35px_rgba(16,185,129,.30)] hover:shadow-[0_20px_40px_rgba(16,185,129,.45)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
            >

              <CircleDollarSign size={22} />

              Create Transaction

            </button>

          </div>

        </div>

        {/* BOTTOM STATS */}

        <div className="grid sm:grid-cols-3 gap-5 mt-10">

          <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 p-5">

            <p className="text-sm text-slate-500">

              Ledger Status

            </p>

            <h3 className="mt-2 text-2xl font-black text-emerald-600">

              Active

            </h3>

          </div>

          <div className="rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100 p-5">

            <p className="text-sm text-slate-500">

              Accounting Engine

            </p>

            <h3 className="mt-2 text-2xl font-black text-cyan-600">

              Running

            </h3>

          </div>

          <div className="rounded-2xl bg-gradient-to-r from-violet-50 to-fuchsia-50 border border-violet-100 p-5">

            <p className="text-sm text-slate-500">

              AI Sync

            </p>

            <h3 className="mt-2 text-2xl font-black text-violet-600">

              Enabled

            </h3>

          </div>

        </div>

      </div>

    </motion.div>

  );

}