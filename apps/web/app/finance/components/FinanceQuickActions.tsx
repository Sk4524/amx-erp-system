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

        <div className="mt-10 rounded-[30px] border border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-cyan-50/60 p-7">

          <div className="flex items-center justify-between mb-6">

            <div>

              <p className="uppercase tracking-[0.25em] text-[11px] font-bold text-emerald-600">

                QUICK ENTRY

              </p>

              <h3 className="mt-2 text-2xl font-black text-slate-900">

                Record Financial Transaction

              </h3>

            </div>

            <div className="rounded-2xl bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">

              Real-time Sync

            </div>

          </div>

          <div className="grid xl:grid-cols-[1.3fr_1fr_auto] gap-5"></div>

        </div>


        {/* LIVE STATUS */}

        <div className="grid sm:grid-cols-3 gap-5 mt-10">

          <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5">

            <div className="flex items-center justify-between">

              <p className="text-sm font-semibold text-slate-600">
                Ledger
              </p>

              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />

            </div>

            <h3 className="mt-4 text-2xl font-black text-emerald-600">
              Active
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Entries are updating in real time.
            </p>

          </div>

          <div className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-5">

            <div className="flex items-center justify-between">

              <p className="text-sm font-semibold text-slate-600">
                Accounting Engine
              </p>

              <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />

            </div>

            <h3 className="mt-4 text-2xl font-black text-cyan-600">
              Running
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Financial calculations are synchronized.
            </p>

          </div>

          <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5">

            <div className="flex items-center justify-between">

              <p className="text-sm font-semibold text-slate-600">
                AI Copilot
              </p>

              <div className="w-3 h-3 rounded-full bg-violet-500 animate-pulse" />

            </div>

            <h3 className="mt-4 text-2xl font-black text-violet-600">
              Online
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Insights and recommendations are available.
            </p>

          </div>

        </div>

      </div>

    </motion.div>

  );

}