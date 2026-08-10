"use client";

import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/formatCurrency";
import {
  TrendingUp,
  Wallet,
  FileText,
  CreditCard,
  Landmark,
} from "lucide-react";

interface Props {
  income: number;
  expense: number;
  profit: number;

  cashBalance: number;

  payables: number;
  receivables: number;
}

export default function FinanceKPIs({
  income,
  expense,
  profit,
  cashBalance,
  payables,
  receivables,
}: Props) {

  const cards = [
    {
      title: "Revenue",
      value: income,
      subtitle: "Total Income",
      badge: "Income",
      icon: TrendingUp,
      color: "emerald",
    },
    {
      title: "Net Profit",
      value: profit,
      subtitle: "Business Profit",
      badge: profit >= 0 ? "Healthy" : "Loss",
      icon: TrendingUp,
      color: "blue",
    },
    {
      title: "Cash Balance",
      value: cashBalance,
      subtitle: "Available Cash",
      badge: "Live",
      icon: Landmark,
      color: "cyan",
    },
    {
      title: "Expenses",
      value: expense,
      subtitle: "Operational Cost",
      badge: expense > income ? "High" : "Normal",
      icon: Wallet,
      color: "red",
    },
    {
      title: "Payables",
      value: payables,
      subtitle: "Outstanding Bills",
      badge: payables === 0 ? "Clear" : "Pending",
      icon: FileText,
      color: "amber",
    },
    {
      title: "Receivables",
      value: receivables,
      subtitle: "Expected Collection",
      badge: receivables === 0 ? "Collected" : "Pending",
      icon: CreditCard,
      color: "indigo",
    },
  ];

  const colors = {
    emerald: {
      border: "from-emerald-500 to-green-400",
      glow: "bg-emerald-400/30",
      icon: "bg-emerald-500 text-white",
      badge: "bg-emerald-100 text-emerald-700",
      line: "from-emerald-500 to-green-400",
    },

    blue: {
      border: "from-blue-500 to-indigo-500",
      glow: "bg-blue-400/30",
      icon: "bg-blue-500 text-white",
      badge: "bg-blue-100 text-blue-700",
      line: "from-blue-500 to-indigo-500",
    },

    cyan: {
      border: "from-cyan-500 to-sky-500",
      glow: "bg-cyan-400/30",
      icon: "bg-cyan-500 text-white",
      badge: "bg-cyan-100 text-cyan-700",
      line: "from-cyan-500 to-sky-500",
    },

    red: {
      border: "from-red-500 to-orange-500",
      glow: "bg-red-400/30",
      icon: "bg-red-500 text-white",
      badge: "bg-red-100 text-red-700",
      line: "from-red-500 to-orange-500",
    },

    amber: {
      border: "from-amber-500 to-orange-500",
      glow: "bg-amber-400/30",
      icon: "bg-amber-500 text-white",
      badge: "bg-amber-100 text-amber-700",
      line: "from-amber-500 to-orange-500",
    },

    indigo: {
      border: "from-indigo-500 to-violet-500",
      glow: "bg-indigo-400/30",
      icon: "bg-indigo-500 text-white",
      badge: "bg-indigo-100 text-indigo-700",
      line: "from-indigo-500 to-violet-500",
    },
  };

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-5 mb-10">

      {cards.map((card, index) => {

        const Icon = card.icon;
        const theme =
          colors[card.color as keyof typeof colors];

        return (

          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{
              y: -8,
              scale: 1.02,
            }}
            className="group relative overflow-hidden rounded-[30px] bg-gradient-to-br from-white to-slate-50 border border-white/70 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,.06)] hover:shadow-[0_18px_55px_rgba(0,0,0,.12)] transition-all duration-500"
          >
            {/* INNER CARD */}

            <div className="relative h-[190px] p-6 flex flex-col justify-between">
              <div
                className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${theme.border}`}
              />

              <div
                className={`absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl ${theme.glow}`}
              />

              {/* GLOW */}

              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/10 to-transparent"></div>

              {/* TOP */}

              <div className="relative z-10 flex items-start justify-between">

                <div>

                 <p className="uppercase tracking-[0.18em] text-xs font-bold text-slate-500">

                    {card.title}

                  </p>

                  <h2
                    className="
                      mt-4
                      text-[28px]
                      xl:text-[36px]
                      font-black
                      tracking-tight
                      text-slate-900
                      leading-none
                      truncate
                    "
                  >
                    {typeof card.value === "number" &&
                      card.title !== "Payables" &&
                      card.title !== "Receivables"
                      ? formatCurrency(card.value)
                      : card.value}
                  </h2>

                </div>

                <div
                  className={`${theme.icon} rounded-3xl rounded-[20px] p-5 shadow-xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-500`}
                >
                  <Icon size={28} />
                </div>

              </div>

              {/* BOTTOM */}

              <div className="relative z-10  flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500 font-semibold mt-4">

                    {card.subtitle}

                  </p>

                </div>

                <div
                  className={`${theme.badge} rounded-full px-3 py-1 text-xs font-bold`}
                >
                  {card.badge}
                </div>

              </div>
              <div
                className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${theme.line} group-hover:w-full transition-all duration-700`}
              />
            </div>

          </motion.div>

        );

      })}

    </div>

  );

}