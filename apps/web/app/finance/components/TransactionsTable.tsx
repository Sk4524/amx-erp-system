"use client";

import { motion } from "framer-motion";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Trash2,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { exportTransactionsToExcel }
  from "../../../lib/exportExcel";
import EmptyState from "./EmptyState";
import { exportTransactionsPDF }
  from "../../../lib/exportPDF";
interface Props {
  transactions: any[];
  loading: boolean;
  role: string;
  onDelete: (id: string) => void;
}

export default function TransactionsTable({
  transactions,
  loading,
  role,
  onDelete,
}: Props) {

  if (loading) {

    return (

      <div className="relative overflow-hidden bg-white/80 backdrop-blur-2xl rounded-[34px] border border-white/50 shadow-[0_10px_35px_rgba(0,0,0,.06)] p-8 mb-8">

        <div className="animate-pulse space-y-5">

          {[...Array(7)].map((_, i) => (

            <div
              key={i}
              className="h-16 rounded-2xl bg-slate-200"
            />

          ))}

        </div>

      </div>

    );

  }

  return (

    <div className="relative overflow-hidden bg-white/80 backdrop-blur-2xl rounded-[34px] border border-white/50 shadow-[0_10px_35px_rgba(0,0,0,.06)] mb-8">

      {/* TOP BORDER */}

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500" />

      {/* GLOW */}

      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-blue-400/15 blur-3xl" />

      <div className="relative z-10">

        {/* HEADER */}

        <div className="flex flex-col lg:flex-row justify-between gap-5 px-8 py-7 border-b border-slate-100">

          <div>

            <p className="uppercase tracking-[0.30em] text-blue-600 text-xs font-bold">

              TRANSACTION HISTORY

            </p>

            <h2 className="mt-2 text-[34px] font-black text-slate-900">

              Recent Transactions

            </h2>

            <p className="mt-2 text-gray-500">

              Complete financial activity across your ERP.

            </p>

          </div>

          <div className="flex flex-wrap items-center gap-3">

            <button
              onClick={() =>
                exportTransactionsToExcel(transactions)
              }
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 text-white px-5 py-3 font-semibold hover:scale-105 transition-all"
            >
              <FileSpreadsheet size={18} />
              Export Excel
            </button>

            <button
              onClick={() =>
                exportTransactionsPDF(transactions)
              }
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 text-white px-5 py-3 font-semibold hover:scale-105 transition-all"
            >
              <Download size={18} />
              Export PDF
            </button>

            <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-500 text-white rounded-3xl px-7 py-5 min-w-[210px]">

              <p className="text-blue-100">
                Total Records
              </p>

              <h2 className="text-4xl font-black mt-2">
                {transactions.length}
              </h2>

            </div>

          </div>

        </div>

        {/* EMPTY */}

        {transactions.length === 0 && (

          <EmptyState
            title="No Transactions"
            description="Financial transactions will appear here once they are created."
          />

        )}
        {
          transactions.length > 0 && (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="sticky top-0 z-20 bg-gradient-to-r from-slate-100 via-white to-slate-100 backdrop-blur-xl border-b border-slate-200">

                  <tr>

                    <th className="px-8 py-5 text-left text-[13px] uppercase tracking-[0.18em] font-black text-slate-500">

                      Type

                    </th>

                    <th className="px-8 py-5 text-left text-[13px] uppercase tracking-[0.18em] font-black text-slate-500">

                      Amount

                    </th>

                    <th className="px-8 py-5 text-left text-[13px] uppercase tracking-[0.18em] font-black text-slate-500">

                      Account

                    </th>

                    <th className="px-8 py-5 text-left text-[13px] uppercase tracking-[0.18em] font-black text-slate-500">

                      Date

                    </th>

                    <th className="px-8 py-5 text-left text-[13px] uppercase tracking-[0.18em] font-black text-slate-500">

                      Action

                    </th>

                  </tr>

                </thead>

                <tbody>

                  {transactions.map((tx: any, index: number) => (

                    <motion.tr

                      key={tx.id}

                      initial={{
                        opacity: 0,
                        y: 20
                      }}

                      animate={{
                        opacity: 1,
                        y: 0
                      }}

                      transition={{
                        delay: index * .04
                      }}

                      className="border-b border-slate-100 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50/60 hover:to-cyan-50/40 hover:shadow-inner"

                    >

                      <td className="px-8 py-6">

                        <div className="flex items-center gap-4">

                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${tx.type === "INCOME"
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-rose-100 text-rose-600"
                              }`}
                          >

                            {tx.type === "INCOME"

                              ? <ArrowUpCircle size={22} />

                              : <ArrowDownCircle size={22} />

                            }

                          </div>

                          <div>

                            <p
                              className={`font-black ${tx.type === "INCOME"
                                ? "text-emerald-600"
                                : "text-rose-600"
                                }`}
                            >

                              {tx.type}

                            </p>

                            <p className="text-xs text-slate-400">

                              Financial Transaction

                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-8 py-6">

                        <div className="inline-flex rounded-2xl bg-slate-100 px-4 py-2">

                          <span className="text-2xl font-black text-slate-900">

                            ₹{Number(tx.amount).toLocaleString()}

                          </span>
                        </div>
                      </td>

                      <td className="px-8 py-6">

                        <div>

                          <p className="font-bold text-slate-800">

                            {tx.account?.name || "General Account"}

                          </p>

                          <p className="text-xs text-slate-400">

                            Ledger Account

                          </p>

                        </div>

                      </td>

                      <td className="px-8 py-6">

                        <div>

                          <p className="font-semibold text-slate-800">

                            {new Date(tx.createdAt).toLocaleDateString()}

                          </p>

                          <p className="text-xs text-slate-400">

                            Created

                          </p>

                        </div>

                      </td>

                      <td className="px-8 py-6">

                        {role === "ADMIN"

                          ? (

                            <button
                              onClick={() => {
                                if (confirm("Delete Transaction?")) {
                                  onDelete(tx.id);
                                }
                              }}
                              className="group flex items-center gap-3 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-red-600 font-bold hover:bg-red-500 hover:text-white transition-all duration-300"
                            >

                              <Trash2
                                size={18}
                                className="group-hover:scale-110 transition-transform"
                              />

                              Delete

                            </button>

                          )

                          : (

                            <span className="text-slate-400">

                              View Only

                            </span>

                          )}

                      </td>

                    </motion.tr>

                  ))}

                </tbody>

              </table>

            </div>

          )
        }

      </div >

    </div >

  );

}