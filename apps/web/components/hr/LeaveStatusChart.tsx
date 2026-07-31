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
  CheckCircle2,
} from "lucide-react";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface Props {
  pending: number;
  approved: number;
  rejected: number;
}

export default function LeaveStatusChart({
  pending,
  approved,
  rejected,
}: Props) {

  const data = {
    labels: [
      "Pending",
      "Approved",
      "Rejected",
    ],
    datasets: [
      {
        data: [
          pending,
          approved,
          rejected,
        ],
        backgroundColor: [
          "#f59e0b",
          "#22c55e",
          "#ef4444",
        ],
        borderWidth: 0,
      },
    ],
  };
  const total =
    pending +
    approved +
    rejected;

  const approvalRate =
    total > 0
      ? Math.round((approved / total) * 100)
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

      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-amber-500 via-emerald-500 to-red-500" />

      {/* Glow */}

      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />

      <div className="relative z-10 flex items-center justify-between mb-8">

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">

            Leave Analytics

          </p>

          <h2 className="mt-2 text-3xl font-black text-slate-900">

            Leave Status

          </h2>

          <p className="mt-2 text-slate-500">

            Monitor approvals, pending requests, and leave decisions.

          </p>

        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 text-white shadow-xl">

          <PieChart size={30} />

        </div>

      </div>

      <div className="mb-8 flex items-center justify-between rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5">

        <div>

          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">

            Leave Approval Rate

          </p>

          <h3 className="mt-2 text-4xl font-black text-emerald-700">

            {approvalRate}%

          </h3>

        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg">

          <CheckCircle2 size={26} />

        </div>

      </div>

      <div className="h-[320px] flex items-center justify-center">
        <Pie
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
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
                position: "bottom",
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