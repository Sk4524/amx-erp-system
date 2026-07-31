"use client";

import { motion } from "framer-motion";
import {
  Building2,
  CalendarDays,
  CircleDollarSign,
  Plus,
  Wallet,
  CheckCircle2,
  Clock3,
} from "lucide-react";

interface Props {
  role: string;
  customers: any[];
  receivables: any[];

  selectedCustomer: string;
  receivableAmount: string;
  receivableDueDate: string;

  setSelectedCustomer: (v: string) => void;
  setReceivableAmount: (v: string) => void;
  setReceivableDueDate: (v: string) => void;

  createReceivable: () => void;
  markReceived: (id: string) => void;
}

export default function ReceivablesCard({
  role,
  customers,
  receivables,

  selectedCustomer,
  receivableAmount,
  receivableDueDate,

  setSelectedCustomer,
  setReceivableAmount,
  setReceivableDueDate,

  createReceivable,
  markReceived,
}: Props) {

  const pendingReceivables = receivables.filter(
    (item: any) => item.status === "PENDING"
  );

  const totalReceivable = pendingReceivables.reduce(
    (sum: number, item: any) => sum + Number(item.amount),
    0
  );
  return (

    <div className="h-full relative overflow-hidden rounded-[34px] bg-white/80 backdrop-blur-2xl border border-white/50 shadow-[0_10px_35px_rgba(0,0,0,.06)]">

      {/* TOP BORDER */}

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600" />

      {/* GLOW */}

      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative z-10 p-7 h-[900px] flex flex-col">

        {/* HEADER */}

        <div className="flex flex-col lg:flex-row justify-between gap-5 mb-8">

          <div>

            <p className="uppercase tracking-[0.28em] text-blue-600 text-xs font-bold">

              Enterprise Finance

            </p>

            <h2 className="mt-2 text-[28px] font-black text-slate-900">

              Accounts Receivable

            </h2>

            <p className="mt-2 text-[15px] text-gray-500">

              Customer invoices, outstanding collections and payment tracking.

            </p>

          </div>

          <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white rounded-3xl px-6 py-5 min-w-[210px]">

            <p className="text-blue-100 text-sm">

              Outstanding Collection

            </p>

            <h2 className="text-4xl font-black mt-2">

              ₹{totalReceivable.toLocaleString()}

            </h2>

            <p className="mt-2 text-sm text-blue-100">

              {pendingReceivables.length} Invoices

            </p>

          </div>

        </div>

        {/* CREATE FORM */}

        {role === "ADMIN" && (

          <div className="mb-8 rounded-[30px] border border-blue-100 bg-gradient-to-br from-cyan-50/70 via-white to-blue-50/70 p-7">

            <div className="flex items-center justify-between mb-6">

              <div>

                <p className="uppercase tracking-[0.28em] text-[11px] font-bold text-blue-600">

                  QUICK RECEIVABLE ENTRY

                </p>

                <h3 className="mt-2 text-2xl font-black text-slate-900">

                  Create Customer Invoice

                </h3>

              </div>

              <div className="rounded-2xl bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">

                Accounts Receivable

              </div>

            </div>

            <div className="grid gap-4">

              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="">

                  Select Customer

                </option>

                {customers.map((c: any) => (

                  <option
                    key={c.id}
                    value={c.name}
                  >

                    {c.name}

                  </option>

                ))}

              </select>

              <input
                type="number"
                placeholder="Invoice Amount"
                value={receivableAmount}
                onChange={(e) => setReceivableAmount(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="date"
                value={receivableDueDate}
                onChange={(e) => setReceivableDueDate(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={createReceivable}
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white font-bold py-4 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all duration-300"
              >

                <Plus size={18} />

                Create Invoice

              </button>

            </div>

          </div>

        )}

        {/* LIST */}

        <div className="flex-1 overflow-y-auto pr-2 space-y-5 custom-scrollbar">

          {receivables.length === 0 && (

            <div className="text-center py-16">

              <Wallet
                size={62}
                className="mx-auto text-blue-500 mb-5"
              />

              <h3 className="text-2xl font-bold text-slate-900">

                No Receivables

              </h3>

              <p className="text-gray-500 mt-2">

                Customer invoices will appear here.

              </p>

            </div>

          )}

          {receivables.map((item: any) => (

            <motion.div

              key={item.id}

              whileHover={{
                y: -6,
                scale: 1.01
              }}

              className="rounded-[30px] bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 p-[1px] shadow-lg"

            >

              <div className="flex justify-between items-start">

                <div className="flex items-center gap-4">

                  <div className="w-16 h-16 rounded-3xl bg-white/15 flex items-center justify-center backdrop-blur-xl border border-white/20">

                    <Building2 size={30} />

                  </div>

                  <div>

                    <p className="uppercase tracking-[0.22em] text-[11px] text-cyan-100 font-bold">

                      Customer

                    </p>

                    <h3 className="mt-1 text-2xl font-black text-white">

                      {item.customerName}

                    </h3>

                    <p className="mt-1 text-white/70">

                      Accounts Receivable Invoice

                    </p>

                  </div>

                </div>

                <div
                  className={`rounded-2xl px-4 py-2 text-sm font-bold backdrop-blur-xl border ${item.status === "RECEIVED"
                      ? "bg-emerald-500/20 border-emerald-300/40"
                      : "bg-amber-500/20 border-amber-300/40"
                    }`}
                >

                  <div className="flex items-center gap-2 text-white">

                    {item.status === "RECEIVED"

                      ? <CheckCircle2 size={16} />

                      : <Clock3 size={16} />

                    }

                    {item.status}

                  </div>

                </div>

              </div>

              <div className="grid md:grid-cols-2 gap-5 mt-8">

                <div className="rounded-3xl bg-white/10 border border-white/15 backdrop-blur-xl p-5">

                  <p className="uppercase tracking-[0.20em] text-[11px] text-cyan-100 font-bold">

                    Invoice Amount

                  </p>

                  <h2 className="mt-3 text-4xl font-black text-white">

                    ₹{Number(item.amount).toLocaleString()}

                  </h2>

                </div>

                <div className="rounded-3xl bg-white/10 border border-white/15 backdrop-blur-xl p-5">

                  <p className="uppercase tracking-[0.20em] text-[11px] text-cyan-100 font-bold">

                    Due Date

                  </p>

                  <div className="mt-4 flex items-center gap-3 text-white text-lg font-bold">

                    <CalendarDays size={20} />

                    {new Date(item.dueDate).toLocaleDateString()}

                  </div>

                </div>

              </div>

              {item.status !== "RECEIVED" && (

                <button
                  onClick={() => markReceived(item.id)}
                  className="group mt-8 w-full rounded-3xl bg-white text-blue-600 font-bold py-4 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                >

                  <div className="rounded-full bg-blue-100 p-2 group-hover:scale-110 transition">

                    <CircleDollarSign size={20} />

                  </div>

                  <span>

                    Mark Invoice as Received

                  </span>

                </button>

              )}

            </motion.div>

          ))}

        </div>

      </div>

    </div>

  );

}