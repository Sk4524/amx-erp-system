"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  TrendingUp,
  Wallet,
  FileText,
  CreditCard,
} from "lucide-react";

interface Props {
  income: number;
  expense: number;
  profit: number;
  accounts: number;
  payables: number;
  receivables: number;
}

export default function FinanceKPIs({
  income,
  expense,
  profit,
  accounts,
  payables,
  receivables,
}: Props) {

  const cards = [

    {
      title: "Net Profit",
      value: profit,
      prefix: "₹",
      subtitle: "Business profitability",
      badge: profit >= 0 ? "Healthy" : "Loss",
      icon: TrendingUp,
      gradient:
        "from-emerald-600 via-green-500 to-teal-400",
    },

    {
      title: "Expenses",
      value: expense,
      prefix: "₹",
      subtitle: "Operational spending",
      badge: expense > income ? "High" : "Controlled",
      icon: Wallet,
      gradient:
        "from-orange-500 via-red-500 to-rose-500",
    },

    {
      title: "Payables",
      value: payables,
      subtitle: "Pending bills",
      badge: payables === 0 ? "Clear" : `${payables} Due`,
      icon: FileText,
      gradient:
        "from-amber-500 via-orange-500 to-red-400",
    },

    {
      title: "Receivables",
      value: receivables,
      subtitle: "Outstanding invoices",
      badge: receivables === 0 ? "Collected" : `${receivables} Pending`,
      icon: CreditCard,
      gradient:
        "from-indigo-600 via-blue-500 to-cyan-400",
    },

  ];

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 mb-10">

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
              y: -8,
            }}
            className={`group relative overflow-hidden rounded-[32px] bg-gradient-to-br ${card.gradient} p-[1px] shadow-lg hover:shadow-2xl transition-all duration-500`}
          >

            {/* INNER CARD */}

            <div className="relative rounded-[31px] bg-white/10 backdrop-blur-2xl px-7 py-6 overflow-hidden h-full">

              {/* GLOW */}

              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>

              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/10 to-transparent"></div>

              {/* TOP */}

              <div className="relative z-10 flex items-start justify-between">

                <div>

                  <p className="text-white text-sm font-semibold tracking-wide">

                    {card.title}

                  </p>

                  <h2 className="mt-3 text-[34px] xl:text-[42px] font-black text-white leading-none">

                    {card.prefix}

                    <CountUp
                      end={card.value}
                      duration={1.8}
                      separator=","
                    />

                  </h2>

                </div>

                <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl p-4 group-hover:scale-110 transition-all duration-500">

                  <Icon
                    size={30}
                    className="text-white"
                  />

                </div>

              </div>

              {/* BOTTOM */}

              <div className="relative z-10 mt-8 flex items-center justify-between">

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