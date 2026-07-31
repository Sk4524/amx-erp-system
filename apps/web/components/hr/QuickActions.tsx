"use client";

import { motion } from "framer-motion";
import {
    UserCheck,
    ClipboardCheck,
    Users,
    FileBarChart2,
} from "lucide-react";

const actions = [
    {
        title: "Mark Attendance",
        icon: ClipboardCheck,
        color: "from-emerald-500 to-green-500",
    },
    {
        title: "Approve Leave",
        icon: UserCheck,
        color: "from-fuchsia-500 to-violet-500",
    },
    {
        title: "Employees",
        icon: Users,
        color: "from-blue-500 to-cyan-500",
    },
    {
        title: "Generate Report",
        icon: FileBarChart2,
        color: "from-orange-500 to-amber-500",
    },
];

export default function QuickActions() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
        >
            <div className="rounded-[30px] border border-white/50 bg-white/70 backdrop-blur-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold mb-6">
                    HR Quick Actions
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {actions.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.title}
                                className={`rounded-2xl bg-gradient-to-r ${item.color} text-white p-5 hover:scale-105 transition-all`}
                            >
                                <Icon className="w-8 h-8 mx-auto mb-3" />

                                <p className="font-semibold text-center">
                                    {item.title}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}