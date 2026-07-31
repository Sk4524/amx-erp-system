"use client";

"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";

import {
    Wallet,
    TrendingUp,
    ArrowDownLeft,
    ArrowUpRight,
    Landmark,
} from "lucide-react";

interface Props {
    financeKPIs: {
        accountBalance: number;
        totalIncome: number;
        totalExpense: number;
        netProfit: number;
        pendingPayables: number;
        pendingReceivables: number;
    };
}

export default function ExecutiveFinanceSummary({
    financeKPIs,
}: Props) {

    const cards = [
        {
            title: "Account Balance",
            value: financeKPIs.accountBalance,
            icon: Wallet,
            iconClass: "text-emerald-600",
            gradient: "from-emerald-600 via-green-500 to-teal-400",
            badge: "Available",
        },
        {
            title: "Net Profit",
            value: financeKPIs.netProfit,
            icon:
                financeKPIs.netProfit >= 0
                    ? TrendingUp
                    : ArrowUpRight,
            iconClass:
                financeKPIs.netProfit >= 0
                    ? "text-emerald-600"
                    : "text-red-600",
            gradient:
                financeKPIs.netProfit >= 0
                    ? "from-emerald-600 via-green-500 to-teal-400"
                    : "from-red-600 via-rose-500 to-orange-500",
            badge:
                financeKPIs.netProfit >= 0
                    ? "Profitable"
                    : "Loss",
        },
        {
            title: "Pending Receivables",
            value: financeKPIs.pendingReceivables,
            icon: ArrowDownLeft,
            iconClass: "text-cyan-600",
            gradient: "from-cyan-600 via-sky-500 to-blue-400",
            badge: "Incoming",
        },
        {
            title: "Pending Payables",
            value: financeKPIs.pendingPayables,
            icon: ArrowUpRight,
            iconClass: "text-orange-500",
            gradient: "from-orange-500 via-amber-500 to-red-400",
            badge: "Outgoing",
        },
        {
            title: "Cash Position",
            value: financeKPIs.accountBalance,
            icon: Landmark,
            iconClass: "text-violet-600",
            gradient: "from-violet-600 via-purple-500 to-indigo-500",
            badge: "Healthy",
        },
    ];

    return (

        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">

            {cards.map((card) => {

                const Icon = card.icon;

                return (

                    <div
                        key={card.title}
                        className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_10px_30px_rgba(0,0,0,.05)] p-6 hover:-translate-y-1 transition-all"
                    >

                        <div className="flex items-center justify-between">

                            <p className="text-sm text-slate-500">

                                {card.title}

                            </p>

                            <Icon
                                size={22}
                                className={card.iconClass}
                            />

                        </div>

                        <h2 className="mt-5 text-3xl font-black text-slate-900">

                            ₹{Number(card.value).toLocaleString()}

                        </h2>

                    </div>

                );

            })}

        </div>

    );

}