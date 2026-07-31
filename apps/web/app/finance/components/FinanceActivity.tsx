"use client";

import {
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";

interface Props {
  transactions: any[];
}

export default function FinanceActivity({
  transactions,
}: Props) {

  const recent =
    transactions.slice(0, 8);

  return (

    <div className="relative overflow-hidden rounded-[34px] bg-white/80 backdrop-blur-2xl border border-white/50 shadow-[0_10px_35px_rgba(0,0,0,.06)] p-8">

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

      <div className="flex items-center justify-between">

        <div>

          <p className="uppercase tracking-[0.30em] text-xs font-bold text-cyan-600">

            LIVE ACTIVITY

          </p>

          <h2 className="mt-2 text-[34px] font-black text-slate-900">

            Recent Finance Events

          </h2>

          <p className="mt-2 text-slate-500">

            Real-time accounting activity across the ERP.

          </p>

        </div>

        <div className="flex flex-col items-end gap-3">

          <div className="rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-6 py-5 text-white min-w-[150px]">

            <p className="text-cyan-100 text-sm">
              Events
            </p>

            <h2 className="mt-2 text-3xl font-black">
              {recent.length}
            </h2>

          </div>

          <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 border border-emerald-200">

            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>

            <span className="text-sm font-semibold text-emerald-700">
              Live Updates
            </span>

          </div>

        </div>

      </div>
      <div className="mt-8 space-y-5">

        {recent.length === 0 ? (

          <div className="py-14 text-center">

            <div className="mx-auto w-20 h-20 rounded-full bg-cyan-100 flex items-center justify-center">

              <ArrowUpCircle
                size={34}
                className="text-cyan-600"
              />

            </div>

            <h3 className="mt-6 text-2xl font-black text-slate-900">

              No Recent Activity

            </h3>

            <p className="mt-3 text-slate-500 max-w-sm mx-auto">

              Finance events will automatically appear here as transactions,
              invoices and ledger updates are recorded.

            </p>

          </div>

        ) : (

          recent.map((tx) => (

            <div
              key={tx.id}
              className="group rounded-[26px] border border-slate-100 bg-gradient-to-br from-white via-slate-50/70 to-cyan-50/40 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              <div className="flex items-start justify-between">

                <div className="flex items-start gap-4">

                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${tx.type === "INCOME"
                      ? "bg-gradient-to-br from-emerald-500 to-green-500 text-white"
                      : "bg-gradient-to-br from-red-500 to-orange-500 text-white"
                      }`}
                  >

                    {tx.type === "INCOME"
                      ? <ArrowUpCircle size={24} />
                      : <ArrowDownCircle size={24} />
                    }

                  </div>

                  <div>

                    <p className="uppercase tracking-[0.18em] text-[10px] font-bold text-slate-500">

                      Finance Activity

                    </p>

                    <h3 className="mt-1 text-lg font-black text-slate-900">

                      {tx.type} Transaction

                    </h3>

                    <p
                      className={`mt-2 text-xl font-black ${tx.type === "INCOME"
                        ? "text-emerald-600"
                        : "text-red-600"
                        }`}
                    >

                      ₹{Number(tx.amount).toLocaleString()}

                    </p>

                  </div>

                </div>

                <div className="text-right">

                  <p className="font-semibold text-slate-800">

                    {new Date(tx.createdAt).toLocaleDateString()}

                  </p>

                  <p className="mt-1 text-xs text-slate-500">

                    {new Date(tx.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}

                  </p>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

}