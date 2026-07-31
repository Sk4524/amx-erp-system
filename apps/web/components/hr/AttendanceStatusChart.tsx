"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { motion } from "framer-motion";

import {
  PieChart,
  Activity,
} from "lucide-react";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface Props {
  present: number;
  absent: number;
  late: number;
  halfDay: number;
}

export default function AttendanceStatusChart({
  present,
  absent,
  late,
  halfDay,
}: Props) {

  const data = {
    labels: [
      "Present",
      "Absent",
      "Late",
      "Half Day",
    ],
    datasets: [
      {
        data: [
          present,
          absent,
          late,
          halfDay,
        ],
        backgroundColor: [
          "#22c55e",
          "#ef4444",
          "#f59e0b",
          "#3b82f6",
        ],
        borderWidth: 0,
      },
    ],
  };

  const total =
  present +
  absent +
  late +
  halfDay;

const attendanceRate =
  total > 0
    ? Math.round((present / total) * 100)
    : 0;

  return (
    <motion.div
  initial={{
    opacity: 0,
    y: 20,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    duration: 0.45,
  }}
  className="relative overflow-hidden rounded-[36px] border border-white/50 bg-white/80 p-7 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,.08)]"
>

  {/* Top Accent */}

  <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 via-fuchsia-500 to-violet-500" />

  {/* Glow */}

  <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-fuchsia-400/15 blur-3xl" />

  <div className="relative z-10 flex items-center justify-between mb-8">

    <div>

      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-fuchsia-600">

        Workforce Analytics

      </p>

      <h2 className="mt-2 text-3xl font-black text-slate-900">

        Attendance Status

      </h2>

      <p className="mt-2 text-slate-500">

        Live attendance distribution across today's workforce.

      </p>

    </div>

    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-purple-500 text-white shadow-xl">

      <PieChart size={30} />

    </div>

  </div>

     <div className="mb-8 flex items-center justify-between rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5">

  <div>

    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">

      Today's Attendance Rate

    </p>

    <h3 className="mt-2 text-4xl font-black text-emerald-700">

      {attendanceRate}%

    </h3>

  </div>

  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg">

    <Activity size={26} />

  </div>

</div>

<div className="h-[320px] flex items-center justify-center">

  <Doughnut
    data={data}
    options={{
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      animation: {
        duration: 1200,
        easing: "easeOutQuart",
      },
      elements: {
        arc: {
          borderRadius: 8,
          borderWidth: 0,
        },
      },
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            padding: 22,
            boxWidth: 10,
            boxHeight: 10,
            font: {
              size: 13,
              weight: 600,
            },
            color: "#475569",
          },
        },
        tooltip: {
          backgroundColor: "#0f172a",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          padding: 12,
          cornerRadius: 12,
          displayColors: true,
        },
      },
    }}
  />

</div>
    </motion.div>
  );
}