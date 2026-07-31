"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { motion } from "framer-motion";

import {
  TrendingUp,
  Activity,
} from "lucide-react";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

interface TrendItem {
  label: string;
  present: number;
}

interface Props {
  data: TrendItem[];
}

export default function AttendanceTrendChart({
  data,
}: Props) {

  const highestAttendance =
    data.length > 0
      ? Math.max(...data.map(item => item.present))
      : 0;

  const averageAttendance =
    data.length > 0
      ? Math.round(
        data.reduce((sum, item) => sum + item.present, 0) / data.length
      )
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

      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500" />

      {/* Glow */}

      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8">

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-600">

            Workforce Analytics

          </p>

          <h2 className="mt-2 text-3xl font-black text-slate-900">

            Attendance Trend

          </h2>

          <p className="mt-2 text-slate-500">

            Analyze workforce attendance patterns and daily participation trends.

          </p>

        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-500 text-white shadow-xl">

          <TrendingUp size={30} />

        </div>

      </div>

      <div className="h-[340px]">
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">

          <div className="flex items-center justify-between rounded-3xl border border-cyan-100 bg-cyan-50/70 p-5">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-600">

                Highest Attendance

              </p>

              <h3 className="mt-2 text-4xl font-black text-cyan-700">

                {highestAttendance}

              </h3>

            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500 text-white shadow-lg">

              <TrendingUp size={26} />

            </div>

          </div>

          <div className="flex items-center justify-between rounded-3xl border border-violet-100 bg-violet-50/70 p-5">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">

                Average Attendance

              </p>

              <h3 className="mt-2 text-4xl font-black text-violet-700">

                {averageAttendance}

              </h3>

            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500 text-white shadow-lg">

              <Activity size={26} />

            </div>

          </div>

        </div>

        <Line
          data={{
            labels: data.map(item => item.label),
            datasets: [
              {
                label: "Present Employees",
                data: data.map(item => item.present),
                borderColor: "#06b6d4",
                backgroundColor: "rgba(6,182,212,0.18)",
                fill: true,
                tension: 0.45,
                borderWidth: 4,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBackgroundColor: "#06b6d4",
                pointBorderColor: "#ffffff",
                pointBorderWidth: 2,
              }
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 1200,
              easing: "easeOutQuart",
            },
            interaction: {
              intersect: false,
              mode: "index",
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
                  color: "#475569",
                  font: {
                    size: 13,
                    weight: 600,
                  },
                },
              },
              tooltip: {
                backgroundColor: "#0f172a",
                titleColor: "#ffffff",
                bodyColor: "#ffffff",
                cornerRadius: 12,
                padding: 12,
                displayColors: true,
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: "#64748b",
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: "rgba(148,163,184,.15)",
                },
                ticks: {
                  color: "#64748b",
                },
              },
            },
          }}
        />

      </div>

    </motion.div>
  );
}