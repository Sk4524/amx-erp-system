"use client";

import { IndianRupee } from "lucide-react";

type Props = {
  transactions: any[];
  isAdmin: boolean;
  isFinance: boolean;
  isManager: boolean;
};

export default function Transactions({

  transactions,

  isAdmin,

  isFinance,

  isManager,

}: Props) {

  if (!(isAdmin || isFinance || isManager))
    return null;

  return (

    <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] relative overflow-hidden p-6 shadow-lg border border-white/50 h-[420px] flex flex-col">

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-400"></div>

      <div className="flex items-center justify-between mb-4">

        <div>

          <h2 className="text-[26px] text-black font-bold">

            Transactions

          </h2>

          <p className="text-sm text-gray-500">

            Recent financial activity

          </p>

        </div>

        <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">

          {transactions.length} total

        </span>

      </div>

      <div className="space-y-4 overflow-y-auto flex-1">

        {transactions.length === 0 ? (

          <div className="flex flex-col items-center justify-center h-full">

            <IndianRupee
              size={40}
              className="text-indigo-500 mb-3"
            />

            <h3 className="font-bold">

              No Transactions

            </h3>

            <p className="text-sm text-gray-500">

              Financial transactions will appear here.

            </p>

          </div>

        ) : (

          transactions.map((tx: any) => (

            <div
              key={tx.id}
              className="text-black flex justify-between border rounded-2xl px-4 py-3 hover:bg-gray-50"
            >

              <div>

                <p
                  className={
                    tx.type === "INCOME"
                      ? "text-green-600 font-semibold"
                      : "text-red-500 font-semibold"
                  }
                >

                  {tx.type}

                </p>

                <p className="text-sm text-gray-500">

                  {tx.account?.name || "No Account"}

                </p>

              </div>

              <div
                className={
                  tx.type === "INCOME"
                    ? "font-bold text-green-600"
                    : "font-bold text-red-500"
                }
              >

                ₹{tx.amount}

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

}