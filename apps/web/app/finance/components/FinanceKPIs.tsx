"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
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

  accounts: number;
  payables: number;
  receivables: number;
}

export default function FinanceKPIs({
  income,
  expense,
  profit,
  cashBalance,
  accounts,
  payables,
  receivables,
}: Props) {

  const cards = [

    {
      title: "Net Profit",
      value: profit,
      prefix: "₹",
      subtitle: "Business Profit",
      badge: profit >= 0 ? "Healthy" : "Loss",
      icon: TrendingUp,
      gradient:
        "from-emerald-500 to-green-500",
    },
    {
      title: "Cash Balance",
      value: cashBalance,
      prefix: "₹",
      subtitle: "Available Cash",
      badge: "Live",
      icon: Landmark,
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      title: "Expenses",
      value: expense,
      prefix: "₹",
      subtitle: "Operational Cost",
      badge: expense > income ? "High" : "Normal",
      icon: Wallet,
      gradient:
        "from-red-500 to-orange-500",
    },

    {
      title: "Payables",
      value: payables,
      subtitle: "Outstanding Bills",
      badge: payables === 0 ? "Clear" : "Pending",
      icon: FileText,
      gradient:
        "from-amber-500 to-orange-500",
    },

    {
      title: "Receivables",
      value: receivables,
      subtitle: "Expected Collection",
      badge: receivables === 0 ? "Collected" : "Pending",
      icon: CreditCard,
      gradient:
        "from-blue-500 to-indigo-500",
    },

    {
      title: "Accounts",
      value: accounts,
      subtitle: "Finance Accounts",
      badge: "Ledger",
      icon: Wallet,
      gradient:
        "from-violet-500 to-purple-500",
    },

  ];
  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-5 mb-10">

      {cards.map((card, index) => {

        const Icon = card.icon;

        return (

          <motion.div
            key={card.title}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.08,
            }}
            whileHover={{
              y: -5,
              scale: 1.015,
            }}
            className={`group relative overflow-hidden rounded-[24px] bg-gradient-to-br ${card.gradient} p-[1px] shadow-lg hover:shadow-2xl transition-all duration-500`}
          >

            {/* INNER CARD */}

            <div className="relative rounded-[23px] bg-white/10 backdrop-blur-2xl px-5 py-5 overflow-hidden h-full">

              {/* GLOW */}

              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>

              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/10 to-transparent"></div>

              {/* TOP */}

              <div className="relative z-10 flex items-start justify-between">

                <div>

                  <p className="text-white text-sm font-semibold tracking-wide">

                    {card.title}

                  </p>

                  <h2 className="mt-3 text-[28px] xl:text-[32px] font-black text-white leading-none">

                    {card.prefix}

                    <CountUp
                      end={card.value}
                      duration={1.8}
                      separator=","
                    />

                  </h2>

                </div>

                <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl p-3 group-hover:scale-110 transition-all duration-500">

                  <Icon
                    size={22}
                    className="text-white"
                  />

                </div>

              </div>

              {/* BOTTOM */}

              <div className="relative z-10 5 flex items-center justify-between">

                <div>

                  <p className="text-sm text-white/90">

                    {card.subtitle}

                  </p>

                </div>

                <div className="bg-white/15 border border-white/20 backdrop-blur-xl px-3 py-1.5 rounded-full text-xs font-semibold text-white">

                  {card.badge}

                </div>

              </div>

            </div>

          </motion.div>

        );

      })}

    </div>

  );

}