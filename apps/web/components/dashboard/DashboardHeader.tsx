"use client";

import { RefreshCw, TrendingUp, Download } from "lucide-react";

type Props = {
  liveStatus: string;
  refreshing: boolean;
  lastUpdated: Date;
  employees: any[];
  inventory: any[];
  transactions: any[];
  analytics: any;
  fetchDashboard: (refresh?: boolean) => void;
  exportDashboardPDF: any;
  exportDashboardExcel: any;
};

export default function DashboardHeader({
  liveStatus,
  refreshing,
  lastUpdated,
  employees,
  inventory,
  transactions,
  analytics,
  fetchDashboard,
  exportDashboardPDF,
  exportDashboardExcel,
}: Props) {
  return (
    <div className="relative overflow-hidden bg-white/75 backdrop-blur-2xl border border-white/50 shadow-[0_20px_70px_rgba(0,0,0,0.08)] rounded-[36px] p-6 xl:p-7 mb-10">

      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-cyan-50/30 pointer-events-none" />

      <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl" />

      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl" />

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500" />

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

        <div className="flex-1 max-w-3xl">

          <div className="flex items-start gap-4">

            <div className="relative">

              <div className="absolute inset-0 bg-cyan-500/30 blur-2xl rounded-full" />

              <div className="relative bg-gradient-to-br from-blue-600 via-cyan-500 to-sky-400 text-white p-4 rounded-[28px] shadow-[0_15px_35px_rgba(37,99,235,0.35)] border border-white/20">

                <TrendingUp size={30} />

              </div>

            </div>

            <div>

              <p className="text-sm uppercase tracking-[0.30em] text-blue-600 font-bold">
                Enterprise ERP
              </p>

              <h1 className="text-4xl sm:text-5xl xl:text-[56px] font-black text-[#0f172a] tracking-tight leading-[0.95] mt-2">
                Dashboard
              </h1>

              <div className="flex flex-wrap items-center gap-3 mt-4">

                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full">
                  LIVE ANALYTICS
                </div>

                <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full">
                  AI POWERED
                </div>

                <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full hidden sm:flex">
                  REAL-TIME ERP
                </div>

              </div>

            </div>

          </div>

          <p className="text-gray-600 text-[17px] leading-relaxed max-w-2xl mt-6">
            Monitor employees, finance, inventory, forecasting,
            analytics and AI business intelligence from one unified ERP platform.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">

            <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-2xl text-sm font-semibold">

              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />

              {liveStatus}

            </div>

            <button
              onClick={() => fetchDashboard(true)}
              className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-2xl text-sm font-semibold"
            >

              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />

              {refreshing ? "Refreshing..." : "Refresh Data"}

            </button>

            <div className="bg-violet-100 text-violet-700 px-4 py-2 rounded-2xl text-sm font-semibold">
              AI Analytics Enabled
            </div>

            <div className="hidden xl:flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-2xl text-sm font-semibold">

              Last Update:

              {lastUpdated.toLocaleTimeString()}

            </div>

          </div>

        </div>

        <div className="flex flex-row xl:flex-col gap-4">

          <button
            onClick={() =>
              exportDashboardPDF(
                employees,
                inventory,
                transactions,
                analytics
              )
            }
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-white px-5 py-3 rounded-[22px]"
          >

            <Download size={17} />

            Export PDF

          </button>

          <button
            onClick={() =>
              exportDashboardExcel(
                employees,
                inventory,
                transactions
              )
            }
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white px-5 py-3 rounded-[22px]"
          >

            <Download size={17} />

            Export Excel

          </button>

        </div>

      </div>

    </div>
  );
}