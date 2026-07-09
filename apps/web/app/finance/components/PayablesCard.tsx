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

            <h2 className="mt-2 text-[34px] font-black text-slate-900">

              Accounts Payable

            </h2>

            <p className="mt-2 text-gray-500">

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

          <div className="flex flex-col gap-4 mb-8 max-w-xl">

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

                    <div className="bg-white/15 p-4 rounded-3xl text-white">

                      <Building2 size={28} />

                    </div>

                    <div>

                      <h3 className="text-2xl font-bold text-white">

                        {item.vendorName}

                      </h3>

                      <p className="text-white/70 mt-1">

                        Vendor Invoice

                      </p>

                    </div>

                  </div>

                  {item.status === "PAID" ? (

                    <div className="bg-green-500/20 border border-green-300/40 text-white px-4 py-2 rounded-full flex items-center gap-2">

                      <CheckCircle2 size={16} />

                      PAID

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

                {item.status !== "PAID" && (

                  <button
                    onClick={() => markPaid(item.id)}
                    className="mt-8 w-full rounded-2xl bg-white text-orange-600 font-bold py-4 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                  >

                    <CircleDollarSign size={20} />

                    Mark as Paid

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