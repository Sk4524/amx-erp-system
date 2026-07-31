"use client";

import { motion } from "framer-motion";
import {
    Brain,
    TrendingUp,
    Users,
    CalendarCheck2,
} from "lucide-react";

interface Props {
    attendance: any[];
    leaves: any[];
}

export default function ExecutiveHRInsights({
    attendance,
    leaves,
}: Props) {

    const attendanceRate =
        attendance.length === 0
            ? 0
            : Math.round(
                  (attendance.filter(
                      (a) => a.status === "PRESENT"
                  ).length /
                      attendance.length) *
                      100
              );

    const pendingLeaves =
        leaves.filter(
            (l) => l.status === "PENDING"
        ).length;

    return (

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative overflow-hidden rounded-[36px] border border-white/50 bg-white/80 p-7 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,.08)]"
        >

            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500" />

            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />

            <div className="relative z-10">

                <div className="flex items-center gap-4 mb-7">

                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-500 text-white shadow-xl">

                        <Brain size={30} />

                    </div>

                    <div>

                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-600">

                            Executive AI

                        </p>

                        <h2 className="mt-2 text-3xl font-black text-slate-900">

                            Workforce Insights

                        </h2>

                    </div>

                </div>

                <div className="grid gap-5 md:grid-cols-3">

                    <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-6">

                        <TrendingUp
                            className="text-cyan-600"
                            size={28}
                        />

                        <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-cyan-600">

                            Attendance Rate

                        </p>

                        <h3 className="mt-2 text-4xl font-black text-cyan-700">

                            {attendanceRate}%

                        </h3>

                    </div>

                    <div className="rounded-3xl border border-violet-100 bg-violet-50 p-6">

                        <CalendarCheck2
                            className="text-violet-600"
                            size={28}
                        />

                        <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-violet-600">

                            Pending Leaves

                        </p>

                        <h3 className="mt-2 text-4xl font-black text-violet-700">

                            {pendingLeaves}

                        </h3>

                    </div>

                    <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">

                        <Users
                            className="text-blue-600"
                            size={28}
                        />

                        <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-blue-600">

                            Workforce Size

                        </p>

                        <h3 className="mt-2 text-4xl font-black text-blue-700">

                            {attendance.length}

                        </h3>

                    </div>

                </div>

            </div>

        </motion.div>

    );

}