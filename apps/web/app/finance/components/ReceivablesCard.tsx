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

            <h2 className="mt-2 text-[34px] font-black text-slate-900">

              Accounts Receivable

            </h2>

            <p className="mt-2 text-gray-500">

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

        {/* FORM */}

        {role === "ADMIN" && (

          <div className="flex flex-col gap-4 mb-8 max-w-xl">

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

              <div className="rounded-[29px] bg-white/10 backdrop-blur-xl p-6">

                <div className="flex justify-between items-start">

                  <div className="flex items-center gap-4">

                    <div className="bg-white/15 p-4 rounded-3xl text-white">

                      <Building2 size={28} />

                    </div>

                    <div>

                      <h3 className="text-2xl font-bold text-white">

                        {item.customerName}

                      </h3>

                      <p className="text-white/70 mt-1">

                        Customer Invoice

                      </p>

                    </div>

                  </div>

                  {item.status === "RECEIVED" ? (

                    <div className="bg-green-500/20 border border-green-300/40 text-white px-4 py-2 rounded-full flex items-center gap-2">

                      <CheckCircle2 size={16} />

                      RECEIVED

                    </div>

                  ) : (

                    <div className="bg-yellow-500/20 border border-yellow-300/40 text-white px-4 py-2 rounded-full flex items-center gap-2">

                      <Clock3 size={16} />

                      PENDING

                    </div>

                  )}

                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-8">

                  <div>

                    <p className="text-white/70 text-sm">

                      Invoice Amount

                    </p>

                    <h2 className="text-4xl font-black text-white mt-2">

                      ₹{Number(item.amount).toLocaleString()}

                    </h2>

                  </div>

                  <div>

                    <p className="text-white/70 text-sm">

                      Due Date

                    </p>

                    <div className="mt-3 flex items-center gap-2 text-white font-semibold">

                      <CalendarDays size={18} />

                      {new Date(item.dueDate).toLocaleDateString()}

                    </div>

                  </div>

                </div>

                {item.status !== "RECEIVED" && (

                  <button
                    onClick={() => markReceived(item.id)}
                    className="mt-8 w-full rounded-2xl bg-white text-blue-600 font-bold py-4 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                  >

                    <CircleDollarSign size={20} />

                    Mark as Received

                  </button>

                )}

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </div>

  );

}