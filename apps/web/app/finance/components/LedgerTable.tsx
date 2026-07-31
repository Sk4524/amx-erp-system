"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  ArrowDownCircle,
  ArrowUpCircle,
  Download,
} from "lucide-react";

interface Props {
  ledger: any[];
}

export default function LedgerTable({
  ledger,
}: Props) {

  return (

    <div className="relative overflow-hidden bg-white/80 backdrop-blur-2xl rounded-[34px] border border-white/50 shadow-[0_10px_35px_rgba(0,0,0,.06)] mb-8">

      {/* TOP BORDER */}

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500" />

      {/* GLOW */}

      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-violet-400/20 blur-3xl" />

      <div className="relative z-10">

        {/* HEADER */}

        <div className="flex flex-col xl:flex-row justify-between gap-6 px-8 py-7 border-b border-slate-100">

          <div>

            <p className="uppercase tracking-[0.30em] text-indigo-600 text-xs font-bold">

              ACCOUNTING LEDGER

            </p>

            <h2 className="mt-2 text-[34px] font-black text-slate-900">

              General Ledger

            </h2>

            <p className="mt-2 text-gray-500">

              Complete double-entry accounting records for your enterprise.

            </p>

          </div>

          <div className="flex flex-wrap items-center gap-3">

            <button
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 text-white px-5 py-3 font-semibold hover:scale-105 transition-all"
            >

              <Download size={18} />

              Export CSV

            </button>

            <button
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 text-white px-5 py-3 font-semibold hover:scale-105 transition-all"
            >

              <Download size={18} />

              Export PDF

            </button>

            <div className="grid grid-cols-2 gap-3">

              <div className="rounded-3xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-5 min-w-[170px]">

                <p className="text-indigo-100 text-sm">
                  Entries
                </p>

                <h2 className="text-3xl font-black mt-2">
                  {ledger.length}
                </h2>

              </div>

              <div className="rounded-3xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-6 py-5 min-w-[170px]">

                <p className="text-violet-100 text-sm">
                  Status
                </p>

                <h2 className="text-2xl font-black mt-3">
                  Balanced
                </h2>

              </div>

            </div>

          </div>

        </div>

        {/* EMPTY */}

        {ledger.length === 0 && (

          <div className="py-20 text-center">

            <BookOpen
              size={70}
              className="mx-auto text-indigo-500 mb-6"
            />

            <h3 className="text-2xl font-bold">

              No Ledger Entries

            </h3>

            <p className="text-gray-500 mt-2">

              Accounting entries will appear here.

            </p>

          </div>

        )}

        {ledger.length > 0 && (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="sticky top-0 bg-slate-50 z-20">

                <tr>

                  <th className="px-8 py-5 text-left font-bold">

                    Description

                  </th>

                  <th className="px-8 py-5 text-left font-bold">

                    Debit

                  </th>

                  <th className="px-8 py-5 text-left font-bold">

                    Credit

                  </th>

                  <th className="px-8 py-5 text-left font-bold">

                    Reference

                  </th>

                  <th className="px-8 py-5 text-left font-bold">

                    Date

                  </th>

                </tr>

              </thead>

              <tbody>

                {ledger.map((item: any, index: number) => (

                  <motion.tr

                    key={item.id}

                    initial={{
                      opacity: 0,
                      y: 15
                    }}

                    animate={{
                      opacity: 1,
                      y: 0
                    }}

                    transition={{
                      delay: index * .03
                    }}

                    className="border-b border-slate-100 hover:bg-indigo-50/40 hover:shadow-md hover:scale-[1.003] transition-all duration-300"
                  >

                    <td className="px-8 py-6">

                      <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-blue-500 text-white flex items-center justify-center shadow-lg">

                          <BookOpen size={22} />

                        </div>

                        <div>

                          <p className="uppercase tracking-[0.18em] text-[10px] font-bold text-indigo-500">

                            Ledger Entry

                          </p>

                          <h3 className="mt-1 text-lg font-black text-slate-900">

                            {item.description}

                          </h3>

                        </div>

                      </div>

                    </td>
                    <td className="px-8 py-6">

                      <div className="inline-flex items-center gap-3 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 px-5 py-3 shadow-sm">

                        <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center">

                          <ArrowDownCircle size={18} />

                        </div>

                        <div>

                          <p className="text-[10px] uppercase tracking-[0.18em] text-red-500 font-bold">

                            Debit

                          </p>

                          <h4 className="font-black text-red-600">

                            ₹{Number(item.debit).toLocaleString()}

                          </h4>

                        </div>

                      </div>

                    </td>

                    <td className="px-8 py-6">

                      <div className="inline-flex items-center gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-5 py-3 shadow-sm">

                        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">

                          <ArrowUpCircle size={18} />

                        </div>

                        <div>

                          <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-600 font-bold">

                            Credit

                          </p>

                          <h4 className="font-black text-emerald-600">

                            ₹{Number(item.credit).toLocaleString()}

                          </h4>

                        </div>

                      </div>

                    </td>

                    <td className="px-8 py-6">

                      <span className="inline-flex items-center rounded-2xl bg-slate-100 border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">

                        {item.reference || "N/A"}

                      </span>

                    </td>

                    <td className="px-8 py-6">

                      <div>

                        <p className="font-bold text-slate-900">

                          {new Date(item.createdAt).toLocaleDateString()}

                        </p>

                        <p className="text-xs text-slate-500 mt-1">

                          {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}

                        </p>

                      </div>

                    </td>

                  </motion.tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );

}