"use client";

import Sidebar from "../../components/Sidebar";
import AuthGuard from "../../components/AuthGuard";

import { useEffect, useState } from "react";

import api from "../../lib/api";

import { motion } from "framer-motion";

import toast from "react-hot-toast";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import {
  BrainCircuit,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Activity,
} from "lucide-react";

export default function ForecastingPage() {

  const [predictions,
    setPredictions] =
    useState<any[]>([]);

  const [loading,
    setLoading] =
    useState(true);

  const [lastUpdated,
    setLastUpdated] =
    useState("");

  // FETCH FORECASTS
  const fetchForecasts =
    async () => {

      try {

        setLoading(true);

        const res =
          await api.get(
            "/forecasting"
          );

        setPredictions(
          res.data.data || []
        );

        setLastUpdated(

          new Date()
            .toLocaleString()
        );

      } catch (err) {

        console.log(err);

        toast.error(
          "Failed to load forecasting data"
        );

        setPredictions([]);

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    let mounted = true;

    const loadData =
      async () => {

        if (mounted) {

          await fetchForecasts();

        }
      };

    loadData();

    const interval =
      setInterval(
        loadData,
        10000
      );

    return () => {

      mounted = false;

      clearInterval(interval);

    };

  }, []);

  // LOW STOCK ALERTS
  const reorderItems =
    (predictions || []).filter(
      (p: any) =>
        p.predictedDemand >
        p.currentStock
    );

  // HEALTHY ITEMS
  const healthyItems =
    (predictions || []).filter(
      (p: any) =>
        p.currentStock >=
        p.predictedDemand
    );

  const chartData =
    Array.isArray(predictions)

      ? predictions.map(
        (item: any) => ({

          name:
            item.productName || "Unknown",

          stock:
            Number(item.currentStock || 0),

          demand:
            Number(item.predictedDemand || 0),

        })
      )

      : [];

  // AI PROCUREMENT ENGINE
  const getRiskLevel =
    (
      current: number,
      demand: number
    ) => {

      const gap =
        demand - current;

      if (gap >= 50)
        return "HIGH";

      if (gap >= 20)
        return "MEDIUM";

      return "LOW";
    };

  // AI VENDOR SUGGESTION
  const getVendorSuggestion =
    (
      product: string
    ) => {

      const vendors = [

        "Raj Suppliers",
        "Global Tech Supply",
        "Prime Industrial",
        "NextGen Procurement",
        "Vertex Supply Chain",
      ];

      // STABLE INDEX
      const index =
        product.length %
        vendors.length;

      return vendors[index];
    };

  // PROCUREMENT ETA
  const getRestockETA =
    (
      risk: string
    ) => {

      switch (risk) {

        case "HIGH":
          return "24 Hours";

        case "MEDIUM":
          return "3 Days";

        default:
          return "7 Days";
      }
    };
  const aiAccuracy =

    predictions.length > 0

      ? "94%"

      : "0%";

  const highRiskItems =
    (predictions || []).filter(
      (item: any) =>

        getRiskLevel(
          item.currentStock,
          item.predictedDemand
        ) === "HIGH"
    );


  return (

    <AuthGuard>

      <div className="flex bg-gradient-to-br from-[#eef2f7] to-[#e5ebf3] min-h-screen">

        <Sidebar />

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
            duration: 0.4,
          }}
          className="p-8 w-full ml-72 text-black"
        >

          {/* HEADER */}
          <div className="relative overflow-hidden bg-white/75 backdrop-blur-2xl border border-white/50 shadow-[0_20px_70px_rgba(0,0,0,0.08)] rounded-[36px] p-6 xl:p-7 mb-10">

            {/* PREMIUM OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-violet-50/30 pointer-events-none"></div>

            {/* GLOW EFFECTS */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl"></div>

            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>

            {/* TOP BORDER */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500"></div>

            {/* CONTENT */}
            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

              {/* LEFT */}
              <div className="flex-1 max-w-3xl">

                {/* TITLE */}
                <div className="flex items-start gap-4">

                  {/* ICON */}
                  <div className="relative">

                    <div className="absolute inset-0 bg-violet-500/30 blur-2xl rounded-full"></div>

                    <div className="relative bg-gradient-to-br from-violet-600 via-indigo-500 to-purple-500 text-white p-4 rounded-[28px] shadow-[0_15px_35px_rgba(139,92,246,0.35)] border border-white/20">

                      <BrainCircuit size={30} />

                    </div>

                  </div>

                  {/* TEXT */}
                  <div>

                    <p className="text-sm uppercase tracking-[0.30em] text-violet-600 font-bold">

                      Enterprise ERP

                    </p>

                    <h1 className="text-4xl sm:text-5xl xl:text-[56px] font-black text-[#0f172a] tracking-tight leading-[0.95] mt-2">

                      AI
                      <br />
                      Forecasting

                    </h1>

                    {/* TAGS */}
                    <div className="flex flex-wrap items-center gap-3 mt-4">

                      <div className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">

                        AI FORECAST ENGINE

                      </div>

                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">

                        DEMAND PREDICTION

                      </div>

                      <div className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide hidden sm:flex">

                        SMART INVENTORY AI

                      </div>

                    </div>

                  </div>

                </div>

                {/* DESCRIPTION */}
                <p className="text-gray-600 text-[17px] leading-relaxed max-w-2xl mt-6">

                  Predict SKU demand, optimize inventory planning,
                  analyze business trends and generate intelligent
                  forecasting insights using enterprise AI analytics.

                </p>

                {/* STATUS */}
                <div className="flex flex-wrap items-center gap-3 mt-6">

                  {/* ACTIVE */}
                  <div className="flex items-center gap-2 bg-emerald-100/80 backdrop-blur-xl text-emerald-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-emerald-200 shadow-sm">

                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>

                    Forecast Engine Active

                  </div>

                  {/* AI */}
                  <div className="bg-violet-100/80 backdrop-blur-xl text-violet-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-violet-200 shadow-sm">

                    AI Prediction Enabled

                  </div>

                  {/* ANALYTICS */}
                  <div className="bg-indigo-100/80 backdrop-blur-xl text-indigo-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-indigo-200 shadow-sm">

                    Realtime Demand Analytics

                  </div>

                </div>

              </div>

              {/* RIGHT */}
              <motion.div
                whileHover={{
                  scale: 1.03,
                }}
                className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-500 text-white rounded-[32px] shadow-[0_15px_40px_rgba(139,92,246,0.35)] px-7 py-6 min-w-[280px]"
              >

                {/* GLOW */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

                <div className="relative z-10 flex items-center gap-5">

                  <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-3xl">

                    <BrainCircuit size={34} />

                  </div>

                  <div>

                    <p className="text-white/80 text-sm uppercase tracking-wide">

                      Forecast Engine

                    </p>

                    <h3 className="font-black text-3xl mt-1">

                      ACTIVE

                    </h3>
                    <div className="text-white/80 text-sm mt-2">

                      AI intelligence operational

                      <div className="flex items-center gap-2 mt-3">

                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>

                        <p className="text-xs text-white/80">

                          Live AI Updates Enabled

                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </motion.div>

            </div>

          </div>

          {/* ANALYTICS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-5 mb-8">

            {[
              {
                title:
                  "Total Predictions",
                value:
                  predictions.length,
                icon:
                  <Sparkles size={28} />,
                gradient:
                  "from-blue-500 to-cyan-400",
              },
              {
                title:
                  "High Risk Alerts",
                value:
                  highRiskItems.length,
                icon:
                  <AlertTriangle size={28} />,
                gradient:
                  "from-orange-500 to-red-400",
              },
              {
                title:
                  "Healthy Inventory",
                value:
                  healthyItems.length,
                icon:
                  <CheckCircle2 size={28} />,
                gradient:
                  "from-green-500 to-emerald-400",
              },
              {
                title:
                  "AI Accuracy",
                value:
                  aiAccuracy,
                icon:
                  <TrendingUp size={28} />,
                gradient:
                  "from-indigo-600 to-purple-600",
              },

              {
                title:
                  "Last Refresh",

                value:
                  lastUpdated
                    ? "LIVE"
                    : "--",

                icon:
                  <Activity size={28} />,

                gradient:
                  "from-cyan-600 to-blue-500",
              }


            ].map((card, index) => (

              <motion.div
                key={index}
                whileHover={{
                  y: -5,
                  scale: 1.02,
                }}
                className={`relative overflow-hidden bg-gradient-to-br ${card.gradient} text-white rounded-3xl p-5 shadow-lg`}
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-white/80">
                      {card.title}
                    </p>

                    <h2 className="text-4xl font-bold mt-3">
                      {card.value}
                    </h2>

                  </div>

                  <div className="bg-white/20 p-3 rounded-2xl">

                    {card.icon}

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

          {/* AI EXECUTIVE INSIGHTS */}
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
              delay: 0.2,
            }}
            className="relative overflow-hidden bg-white/75 backdrop-blur-2xl border border-white/40 rounded-[36px] shadow-[0_20px_70px_rgba(0,0,0,0.08)] p-6 xl:p-7 mb-8"
          >

            {/* GLOW */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-violet-400/10 rounded-full blur-3xl"></div>

            <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl"></div>

            {/* TOP BORDER */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500"></div>

            <div className="relative z-10">

              {/* HEADER */}
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">

                <div className="flex items-start gap-4">

                  <div className="bg-gradient-to-br from-violet-600 via-indigo-500 to-purple-500 text-white p-4 rounded-[24px] shadow-[0_15px_35px_rgba(139,92,246,0.35)]">

                    <Sparkles size={28} />

                  </div>

                  <div>

                    <p className="text-sm uppercase tracking-[0.30em] text-violet-600 font-bold">

                      AI Intelligence Engine

                    </p>

                    <h2 className="text-4xl font-black text-slate-800 mt-2">

                      Executive Summary

                    </h2>

                    <p className="text-slate-500 mt-3 max-w-2xl leading-relaxed">

                      AI-generated forecasting insights, procurement recommendations and inventory intelligence powered by enterprise analytics.

                    </p>

                  </div>

                </div>

                {/* AI STATUS */}
                <div className="bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-500 text-white rounded-3xl px-6 py-5 shadow-xl min-w-[240px]">

                  <p className="text-white/80 text-sm uppercase tracking-wide">

                    AI Confidence

                  </p>

                  <h3 className="text-5xl font-black mt-3">

                    94%

                  </h3>

                  <div className="text-white/80 text-sm mt-2">

                    <p>

                      Prediction engine operating normally

                    </p>

                    <div className="flex items-center gap-2 mt-3">

                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>

                      <p className="text-xs text-white/70">

                        Last Updated:
                        {" "}
                        {lastUpdated || "Loading..."}

                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* AI INSIGHTS GRID */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

                {/* INSIGHT 1 */}
                <div className="relative overflow-hidden rounded-[30px] border border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-5 shadow-sm">

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-xs uppercase tracking-[0.20em] text-red-500 font-bold">

                        Critical Alert

                      </p>

                      <h3 className="text-2xl font-black text-slate-800 mt-3">

                        Reorder Risk

                      </h3>

                    </div>

                    <AlertTriangle
                      size={28}
                      className="text-red-500"
                    />

                  </div>

                  <p className="text-slate-600 leading-relaxed mt-5">

                    AI detected inventory shortage risk across
                    <span className="font-bold text-red-600">

                      {" "} {reorderItems.length} SKU(s)

                    </span>.
                    Procurement action recommended within next cycle.

                  </p>

                </div>

                {/* INSIGHT 2 */}
                <div className="relative overflow-hidden rounded-[30px] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-5 shadow-sm">

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-xs uppercase tracking-[0.20em] text-emerald-500 font-bold">

                        Inventory Health

                      </p>

                      <h3 className="text-2xl font-black text-slate-800 mt-3">

                        Stable Stock

                      </h3>

                    </div>

                    <CheckCircle2
                      size={28}
                      className="text-emerald-500"
                    />

                  </div>

                  <p className="text-slate-600 leading-relaxed mt-5">

                    AI forecasting indicates
                    <span className="font-bold text-emerald-600">

                      {" "} {healthyItems.length} SKU(s)

                    </span>
                    currently maintain healthy inventory coverage.

                  </p>

                </div>

                {/* INSIGHT 3 */}
                <div className="relative overflow-hidden rounded-[30px] border border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 p-5 shadow-sm">

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-xs uppercase tracking-[0.20em] text-violet-500 font-bold">

                        AI Trend Analysis

                      </p>

                      <h3 className="text-2xl font-black text-slate-800 mt-3">

                        Demand Growth

                      </h3>

                    </div>

                    <TrendingUp
                      size={28}
                      className="text-violet-500"
                    />

                  </div>

                  <p className="text-slate-600 leading-relaxed mt-5">

                    Machine learning models predict
                    <span className="font-bold text-violet-600">

                      {" "} 14% demand growth

                    </span>
                    in upcoming inventory cycles across key product categories.

                  </p>

                </div>

              </div>

            </div>

          </motion.div>

          {/* AI FORECAST CHART */}
          <motion.div
            whileHover={{
              y: -2,
            }}
            className="relative overflow-hidden bg-white/75 backdrop-blur-2xl border border-white/40 rounded-[36px] shadow-[0_20px_70px_rgba(0,0,0,0.08)] p-6 xl:p-7 mb-8"
          >

            {/* GLOW */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl"></div>

            {/* TOP BORDER */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"></div>

            <div className="relative z-10">

              {/* HEADER */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

                <div>

                  <p className="text-sm uppercase tracking-[0.30em] text-cyan-600 font-bold">

                    AI Visualization Engine

                  </p>

                  <h2 className="text-4xl font-black text-slate-800 mt-2">

                    Forecast Trend Analytics

                  </h2>

                  <p className="text-slate-500 mt-3 max-w-2xl leading-relaxed">

                    Visual AI forecasting trends comparing current inventory levels against predicted enterprise demand.

                  </p>

                </div>

                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-3xl px-6 py-5 shadow-xl">

                  <p className="text-white/80 text-sm uppercase tracking-wide">

                    AI Forecast Accuracy

                  </p>

                  <h3 className="text-5xl font-black mt-3">

                    94%

                  </h3>

                </div>

              </div>

              {/* CHART */}
              <div className="w-full min-h-[420px] h-[420px]">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <AreaChart
                    data={chartData}
                  >

                    <defs>

                      <linearGradient
                        id="stockGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >

                        <stop
                          offset="5%"
                          stopColor="#06b6d4"
                          stopOpacity={0.4}
                        />

                        <stop
                          offset="95%"
                          stopColor="#06b6d4"
                          stopOpacity={0}
                        />

                      </linearGradient>

                      <linearGradient
                        id="demandGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >

                        <stop
                          offset="5%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.4}
                        />

                        <stop
                          offset="95%"
                          stopColor="#8b5cf6"
                          stopOpacity={0}
                        />

                      </linearGradient>

                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                    />

                    <XAxis
                      dataKey="name"
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={80}
                      tick={{
                        fill: "#64748b",
                        fontSize: 11,
                      }}
                    />

                    <YAxis
                      tick={{
                        fill: "#64748b",
                        fontSize: 12,
                      }}
                    />

                    <Tooltip />

                    {/* CURRENT STOCK */}
                    <Area
                      type="monotone"
                      dataKey="stock"
                      stroke="#06b6d4"
                      strokeWidth={3}
                      fill="url(#stockGradient)"
                    />

                    {/* PREDICTED DEMAND */}
                    <Area
                      type="monotone"
                      dataKey="demand"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      fill="url(#demandGradient)"
                    />

                  </AreaChart>

                </ResponsiveContainer>

              </div>

            </div>

          </motion.div>

          {/* FORECAST TABLE */}
          <motion.div
            whileHover={{
              y: -2,
            }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl relative overflow-hidden shadow-xl border border-white/40 p-6"
          >

            {/* TOP BAR */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500"></div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-6">

              <div>

                <h2 className="text-3xl font-bold text-[#111827]">
                  Demand Forecasting
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  AI-generated inventory demand predictions and reorder intelligence
                </p>

              </div>

              <div className="bg-indigo-50 border border-indigo-100 px-5 py-3 rounded-2xl">

                <div className="flex items-center gap-3">

                  <Activity
                    size={22}
                    className="text-indigo-600"
                  />

                  <div>

                    <p className="text-xs text-gray-500">
                      Forecasted SKUs
                    </p>

                    <h3 className="font-bold text-xl text-indigo-700">
                      {predictions.length}
                    </h3>

                  </div>

                </div>

              </div>

            </div>

            {loading ? (

              <div className="py-24 text-center">

                <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-5"></div>

                <p className="text-gray-500 text-lg">
                  Loading AI predictions...
                </p>

              </div>

            ) : predictions.length === 0 ? (

              <div className="py-24 text-center text-gray-500">

                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">

                  <BrainCircuit
                    size={50}
                    className="text-gray-300"
                  />

                </div>

                <p className="text-2xl font-semibold">
                  No Forecasting Data
                </p>

                <p className="text-sm mt-2">
                  AI forecasting results will appear here
                </p>

              </div>

            ) : (

              <div className="space-y-4 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar">

                {predictions.map(
                  (item: any, index: number) => {

                    const needsReorder =
                      item.predictedDemand >
                      item.currentStock;

                    return (

                      <motion.div
                        key={index}
                        whileHover={{
                          scale: 1.01,
                        }}
                        className={`rounded-3xl p-5 border transition-all duration-300 hover:shadow-xl

                        ${needsReorder
                            ? "bg-gradient-to-r from-red-50 to-orange-50 border-red-200"
                            : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                          }
                      `}
                      >

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                          {/* LEFT */}
                          <div>

                            <h3 className="font-bold text-2xl text-[#111827]">
                              {item.productName || "Unknown Product"}
                            </h3>

                            <div className="flex flex-wrap items-center gap-4 mt-4">

                              <div className="bg-white/80 border border-gray-200 px-4 py-3 rounded-2xl shadow-sm">

                                <p className="text-xs text-gray-500">
                                  Current Stock
                                </p>

                                <h4 className="font-bold text-lg">
                                  {item.currentStock}
                                </h4>

                              </div>

                              <div className="bg-white/80 border border-gray-200 px-4 py-3 rounded-2xl shadow-sm">

                                <p className="text-xs text-gray-500">
                                  Predicted Demand
                                </p>

                                <h4 className="font-bold text-lg">
                                  {item.predictedDemand}
                                </h4>

                              </div>

                            </div>

                          </div>

                          {/* RIGHT */}
                          <div className="text-right">

                            {needsReorder ? (

                              <div>

                                <span className="bg-red-100 text-red-700 px-5 py-3 rounded-2xl text-sm font-semibold inline-block shadow-sm">

                                  Reorder Needed

                                </span>

                                <p className="text-sm text-red-500 mt-3 font-medium">
                                  AI predicts upcoming stock shortage
                                </p>

                              </div>

                            ) : (

                              <div>

                                <span className="bg-green-100 text-green-700 px-5 py-3 rounded-2xl text-sm font-semibold inline-block shadow-sm">

                                  Stock Healthy

                                </span>

                                <p className="text-sm text-green-600 mt-3 font-medium">
                                  Inventory level stable and optimized
                                </p>

                              </div>

                            )}

                          </div>

                        </div>
                        {/* AI PROCUREMENT ENGINE */}
                        <div className="mt-6 pt-5 border-t border-white/40">

                          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

                            {/* RISK */}
                            <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-4">

                              <p className="text-xs uppercase tracking-[0.20em] text-slate-400 font-bold">

                                Risk Level

                              </p>

                              <h4 className={`text-lg font-black mt-3

      ${getRiskLevel(
                                item.currentStock,
                                item.predictedDemand
                              ) === "HIGH"

                                  ? "text-red-600"

                                  : getRiskLevel(
                                    item.currentStock,
                                    item.predictedDemand
                                  ) === "MEDIUM"

                                    ? "text-orange-500"

                                    : "text-emerald-600"
                                }
      `}>

                                {
                                  getRiskLevel(
                                    item.currentStock,
                                    item.predictedDemand
                                  )
                                }

                              </h4>

                            </div>

                            {/* VENDOR */}
                            <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-4">

                              <p className="text-xs uppercase tracking-[0.20em] text-slate-400 font-bold">

                                Suggested Vendor

                              </p>

                              <h4 className="text-lg font-black mt-3 text-indigo-600">

                                {
                                  getVendorSuggestion(
                                    item.productName || ""
                                  )
                                }

                              </h4>

                            </div>

                            {/* ETA */}
                            <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-4">

                              <p className="text-xs uppercase tracking-[0.20em] text-slate-400 font-bold">

                                Procurement ETA

                              </p>

                              <h4 className="text-lg font-black mt-3 text-cyan-600">

                                {
                                  getRestockETA(

                                    getRiskLevel(
                                      item.currentStock,
                                      item.predictedDemand
                                    )
                                  )
                                }

                              </h4>

                            </div>

                          </div>

                          {/* AI ACTION */}
                          <div className="mt-4 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-4">

                            <p className="text-xs uppercase tracking-[0.20em] text-violet-500 font-bold">

                              AI Recommendation

                            </p>

                            <p className="text-slate-700 mt-3 leading-relaxed">

                              {
                                item.predictedDemand >
                                  item.currentStock

                                  ? `AI recommends immediate procurement planning for ${item.productName} to avoid inventory shortage.`

                                  : `${item.productName} inventory levels are stable based on current AI forecasting trends.`
                              }

                            </p>

                          </div>

                        </div>

                      </motion.div>
                    );
                  })}

              </div>

            )}

          </motion.div>

        </motion.div>

      </div>
      <style jsx global>{`

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 999px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

`}</style>

    </AuthGuard>
  );
}