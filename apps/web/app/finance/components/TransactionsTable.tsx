"use client";

import { motion } from "framer-motion";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Trash2,
  Receipt,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { exportTransactionsToExcel }
  from "../../../lib/exportExcel";

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

        {/* EMPTY */ }

  {
    transactions.length === 0 && (

      <div className="py-20 text-center">

        <Receipt
          size={70}
          className="mx-auto text-blue-500 mb-6"
        />

        <h3 className="text-2xl font-bold">

          No Transactions

        </h3>

        <p className="text-gray-500 mt-2">

          Financial transactions will appear here.

        </p>

      </div>

    )
  }

  {
    transactions.length > 0 && (

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="sticky top-0 bg-slate-50 z-20">

            <tr>

              <th className="px-8 py-5 text-left font-bold">

                Type

              </th>

              <th className="px-8 py-5 text-left font-bold">

                Amount

              </th>

              <th className="px-8 py-5 text-left font-bold">

                Account

              </th>

              <th className="px-8 py-5 text-left font-bold">

                Date

              </th>

              <th className="px-8 py-5 text-left font-bold">

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

                className="border-b border-slate-100 hover:bg-blue-50/40 transition-all duration-300"

              >

                <td className="px-8 py-6">

                  <div className="flex items-center gap-3">

                    <div
                      className={`p-2 rounded-2xl ${tx.type === "INCOME"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                        }`}
                    >

                      {tx.type === "INCOME"

                        ? <ArrowUpCircle size={20} />

                        : <ArrowDownCircle size={20} />

                      }

                    </div>

                    <span
                      className={`font-semibold ${tx.type === "INCOME"
                        ? "text-green-600"
                        : "text-red-500"
                        }`}
                    >

                      {tx.type}

                    </span>

                  </div>

                </td>

                <td className="px-8 py-6">

                  <span className="text-xl font-black text-slate-900">

                    ₹{Number(tx.amount).toLocaleString()}

                  </span>

                </td>

                <td className="px-8 py-6 font-medium">

                  {tx.account?.name || "-"}

                </td>

                <td className="px-8 py-6 text-gray-500">

                  {new Date(tx.createdAt).toLocaleDateString()}

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

                        className="flex items-center gap-2 rounded-2xl bg-red-500 hover:bg-red-600 text-white px-5 py-3 transition-all duration-300 hover:scale-105"

                      >

                        <Trash2 size={17} />

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