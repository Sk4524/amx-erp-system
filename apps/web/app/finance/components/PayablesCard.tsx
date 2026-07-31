"use client";

import { motion } from "framer-motion";
import {
  Building2,
  CalendarDays,
  CircleDollarSign,
  Plus,
  Receipt,
  CheckCircle2,
  Clock3,
} from "lucide-react";

interface Props {
  role: string;
  vendors: any[];
  payables: any[];

  selectedVendor: string;
  payableAmount: string;
  payableDueDate: string;

  setSelectedVendor: (v: string) => void;
  setPayableAmount: (v: string) => void;
  setPayableDueDate: (v: string) => void;

  createPayable: () => void;
  markPaid: (id: string) => void;
}

export default function PayablesCard({
  role,
  vendors,
  payables,

  selectedVendor,
  payableAmount,
  payableDueDate,

  setSelectedVendor,
  setPayableAmount,
  setPayableDueDate,

  createPayable,
  markPaid,
}: Props) {

  const pendingPayables = payables.filter(
    (item: any) => item.status === "PENDING"
  );

  const totalAmount = pendingPayables.reduce(
    (sum: number, item: any) => sum + Number(item.amount),
    0
  );

  return (

    <div className="h-full relative overflow-hidden rounded-[34px] bg-white/80 backdrop-blur-2xl border border-white/50 shadow-[0_10px_35px_rgba(0,0,0,.06)]">

      {/* TOP BORDER */}

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-red-500" />

      {/* GLOW */}

      <div className="absolute -top-24 -right-20 w-72 h-72 bg-orange-300/20 rounded-full blur-3xl" />

      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-yellow-300/20 rounded-full blur-3xl" />

      <div className="relative z-10 p-7 h-[900px] flex flex-col">

        {/* HEADER */}

        <div className="flex flex-col lg:flex-row justify-between gap-5 mb-8">

          <div>

            <p className="uppercase tracking-[0.28em] text-orange-600 text-xs font-bold">

              Enterprise Finance

            </p>

            <h2 className="mt-2 text-[28px] font-black text-slate-900">

              Accounts Payable

            </h2>

            <p className="mt-2 text-[15px] text-gray-500">

              Vendor invoices, pending bills and payment management.

            </p>

          </div>

          <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 text-white rounded-3xl px-6 py-5 min-w-[210px]">

            <p className="text-orange-100 text-sm">

              Outstanding Amount

            </p>

            <h2 className="text-4xl font-black mt-2">

              ₹{totalAmount.toLocaleString()}

            </h2>

            <p className="mt-2 text-sm text-orange-100">

              {pendingPayables.length} Bills

            </p>

          </div>

        </div>

        {/* CREATE FORM */}

        {role === "ADMIN" && (

          <div className="mb-8 rounded-[30px] border border-orange-100 bg-gradient-to-br from-orange-50/70 via-white to-amber-50/70 p-7">

            <div className="flex items-center justify-between mb-6">

              <div>

                <p className="uppercase tracking-[0.28em] text-[11px] font-bold text-orange-600">

                  QUICK PAYABLE ENTRY

                </p>

                <h3 className="mt-2 text-2xl font-black text-slate-900">

                  Create Vendor Invoice

                </h3>

              </div>

              <div className="rounded-2xl bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">

                Accounts Payable

              </div>

            </div>

            <div className="grid gap-4">

              <select
                className="w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none focus:ring-2 focus:ring-orange-500"
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
              >

                <option value="">
                  Select Vendor
                </option>

                {vendors.map((v: any) => (

                  <option
                    key={v.id}
                    value={v.name}
                  >
                    {v.name}
                  </option>

                ))}

              </select>

              <input
                type="number"
                className="w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none focus:ring-2 focus:ring-orange-500"
                value={payableAmount}
                onChange={(e) => setPayableAmount(e.target.value)}
                placeholder="Invoice Amount"
              />

              <input
                type="date"
                value={payableDueDate}
                onChange={(e) => setPayableDueDate(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none focus:ring-2 focus:ring-orange-500"
              />

              <button
                onClick={createPayable}
                className="w-full rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 text-white font-bold py-4 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all duration-300"
              >
                <Plus size={18} />
                Create Payable
              </button>

            </div>
          </div>

        )}

        {/* LIST */}

        <div className="flex-1 overflow-y-auto pr-2 space-y-5 custom-scrollbar">

          {payables.length === 0 && (

            <div className="text-center py-16">

              <Receipt
                size={62}
                className="mx-auto text-orange-500 mb-5"
              />

              <h3 className="text-2xl font-bold text-slate-900">

                No Payables

              </h3>

              <p className="text-gray-500 mt-2">

                Vendor bills will appear here.

              </p>

            </div>

          )}

          {payables.map((item: any) => (

            <motion.div

              key={item.id}

              whileHover={{
                y: -6,
                scale: 1.01,
              }}

              className="rounded-[30px] bg-gradient-to-br from-orange-500 via-amber-500 to-red-500 p-[1px] shadow-lg"

            >

              <div className="rounded-[29px] bg-white/10 backdrop-blur-xl p-6">

                <div className="flex justify-between items-start">

                  <div className="flex items-center gap-4">

                    <div className="w-16 h-16 rounded-3xl bg-white/15 flex items-center justify-center backdrop-blur-xl border border-white/20">

                      <Building2 size={30} />

                    </div>

                    <div>

                      <p className="uppercase tracking-[0.22em] text-[11px] text-orange-100 font-bold">

                        Vendor

                      </p>

                      <h3 className="mt-1 text-2xl font-black text-white">

                        {item.vendorName}

                      </h3>

                      <p className="mt-1 text-white/70">

                        Accounts Payable Invoice

                      </p>

                    </div>

                  </div>

                  <div
                    className={`rounded-2xl px-4 py-2 text-sm font-bold backdrop-blur-xl border ${item.status === "PAID"
                      ? "bg-emerald-500/20 border-emerald-300/40"
                      : "bg-amber-500/20 border-amber-300/40"
                      }`}
                  >

                    <div className="flex items-center gap-2 text-white">

                      {item.status === "PAID"

                        ? <CheckCircle2 size={16} />

                        : <Clock3 size={16} />

                      }

                      {item.status}

                    </div>

                  </div>

                </div>

                <div className="grid md:grid-cols-2 gap-5 mt-8">

                  <div className="rounded-3xl bg-white/10 border border-white/15 backdrop-blur-xl p-5">

                    <p className="uppercase tracking-[0.20em] text-[11px] text-orange-100 font-bold">

                      Invoice Amount

                    </p>

                    <h2 className="mt-3 text-4xl font-black text-white">

                      ₹{Number(item.amount).toLocaleString()}

                    </h2>

                  </div>

                  <div className="rounded-3xl bg-white/10 border border-white/15 backdrop-blur-xl p-5">

                    <p className="uppercase tracking-[0.20em] text-[11px] text-orange-100 font-bold">

                      Due Date

                    </p>

                    <div className="mt-4 flex items-center gap-3 text-white text-lg font-bold">

                      <CalendarDays size={20} />

                      {new Date(item.dueDate).toLocaleDateString()}

                    </div>

                  </div>

                </div>

                {item.status !== "PAID" && (

                  <button
                    onClick={() => markPaid(item.id)}
                    className="group mt-8 w-full rounded-3xl bg-white text-orange-600 font-bold py-4 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                  >

                    <div className="rounded-full bg-orange-100 p-2 group-hover:scale-110 transition">

                      <CircleDollarSign size={20} />

                    </div>

                    <span>

                      Mark Invoice as Paid

                    </span>

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