"use client";

import CountUp from "react-countup";
import { motion } from "framer-motion";
import {
  Users,
  CalendarCheck2,
  CalendarClock,
  Clock3,
  UserCheck,
  ArrowUpRight,
} from "lucide-react";

interface Props {
  totalEmployees: number;
  attendanceRecords: number;
  leaveRequests: number;
  pendingLeaves: number;
  present: number;
}

export default function DashboardCards({
  totalEmployees,
  attendanceRecords,
  leaveRequests,
  pendingLeaves,
  present,
}: Props) {

  const cards = [
    {
      title: "Attendance Records",
      value: attendanceRecords,
      icon: CalendarCheck2,
      gradient: "from-blue-500 to-cyan-400",
      badge: "Daily Records",
    },
    {
      title: "Leave Requests",
      value: leaveRequests,
      icon: CalendarClock,
      gradient: "from-purple-600 to-pink-500",
      badge: "Workflow",
    },
    {
      title: "Pending Leaves",
      value: pendingLeaves,
      icon: Clock3,
      gradient: "from-red-500 to-orange-400",
      badge: "Needs Review",
    },
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: Users,
      gradient: "from-emerald-500 to-green-400",
      badge: "Workforce",
    },
    {
      title: "Present Today",
      value: present,
      icon: UserCheck,
      gradient: "from-indigo-500 to-blue-500",
      badge: "Live Status",
    },
  ];
  const attendanceRate =
  totalEmployees > 0
    ? Math.round((present / totalEmployees) * 100)
    : 0;

const workforceHealth =
  attendanceRate >= 90
    ? "Excellent"
    : attendanceRate >= 75
      ? "Good"
      : attendanceRate >= 60
        ? "Average"
        : "Needs Attention";

 return (
  <>
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">

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
            duration: 0.4,
            delay: index * 0.08,
          }}
          whileHover={{
            y: -6,
          }}
          className={`relative overflow-hidden rounded-[32px] bg-gradient-to-r ${card.gradient} p-7 text-white shadow-[0_18px_45px_rgba(0,0,0,.18)]`}
        >

          {/* Glow */}

          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

          {/* Header */}

          <div className="relative flex items-start justify-between">

            <div>

              <p className="text-sm text-white/80">

                {card.title}

              </p>

              <h2 className="mt-5 text-5xl font-black">

                <CountUp
                  end={card.value}
                  duration={1.4}
                />

              </h2>

            </div>

            <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-xl">

              <Icon size={28} />

            </div>

          </div>

          {/* Footer */}

          <div className="relative mt-8 flex items-center justify-between">

            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-xl">

              {card.badge}

            </span>

            <ArrowUpRight
              size={18}
              className="text-white/80"
            />

          </div>

        </motion.div>

      );

    })}

  </div>
  <div className="mb-10 rounded-[32px] border border-white/50 bg-white/80 backdrop-blur-2xl p-6 shadow-[0_15px_45px_rgba(0,0,0,.08)]">

  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

    <div>

      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-fuchsia-600">

        Executive Workforce Summary

      </p>

      <h3 className="mt-2 text-3xl font-black text-slate-900">

        Workforce Health Overview

      </h3>

      <p className="mt-2 text-slate-500">

        Real-time attendance insights for today's workforce.

      </p>

    </div>

    <div className="flex flex-wrap gap-4">

      <div className="rounded-2xl bg-emerald-50 px-6 py-4 border border-emerald-200">

        <p className="text-xs font-semibold uppercase text-emerald-600">

          Attendance Rate

        </p>

        <h4 className="mt-1 text-3xl font-black text-emerald-700">

          {attendanceRate}%

        </h4>

      </div>

      <div className="rounded-2xl bg-violet-50 px-6 py-4 border border-violet-200">

        <p className="text-xs font-semibold uppercase text-violet-600">

          Workforce Health

        </p>

        <h4 className="mt-1 text-2xl font-black text-violet-700">

          {workforceHealth}

        </h4>

      </div>

    </div>

  </div>

</div>
</>
);
}