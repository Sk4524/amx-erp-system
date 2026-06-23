"use client";
import Sidebar from "../components/Sidebar";
import AuthGuard from "../components/AuthGuard";
import AIChatbot
  from "../components/AIChatbot";
import socket from "../lib/socket";
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Download,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

import {
  useEffect,
  useState,
  useMemo,
} from "react";

import {
  useRouter
} from "next/navigation";

import api from "../lib/api";
import CountUp from "react-countup";
import { exportDashboardPDF }
  from "../lib/exportPDF";

import { exportDashboardExcel }
  from "../lib/exportExcel";

import ReactECharts
  from "echarts-for-react";


export default function DashboardPage() {

  const router =
    useRouter();

  const [role, setRole] =
    useState("");

  const [employees, setEmployees] =
    useState<any[]>([]);

  const [inventory, setInventory] =
    useState<any[]>([]);

  const [transactions, setTransactions] =
    useState<any[]>([]);

  const [analytics, setAnalytics] =
    useState<any>(null);

  const [aiInsights,
    setAiInsights] =
    useState<any>(null);

  const [
    advancedAnalytics,
    setAdvancedAnalytics
  ] = useState<any>(null);

  const [loading,
    setLoading] =
    useState(true);


  const [refreshing,
    setRefreshing] =
    useState(false);

  const [lastUpdated,
    setLastUpdated] =
    useState(new Date());

  const [liveStatus,
    setLiveStatus] =
    useState("Connected");

  const [isFetching,
    setIsFetching] =
    useState(false);

  useEffect(() => {

    const savedRole =
      localStorage.getItem("role");

    if (savedRole) {

      setRole(savedRole);
    }

  }, []);


  // FETCH DATA
  const fetchDashboard =
    async (
      isRefresh = false
    ) => {
      if (isFetching) return;

      setIsFetching(true);

      try {

        if (isRefresh) {

          setRefreshing(true);

        } else {

          setLoading(true);
        }


        // DASHBOARD ANALYTICS
        // DASHBOARD ANALYTICS
        const analyticsRes =
          await api.get(
            "/analytics/dashboard"
          );

        let aiRes = null;
        let advancedRes = null;

        // AI INSIGHTS
        if (
          role === "ADMIN" ||
          role === "MANAGER" ||
          role === "HR" ||
          role === "FINANCE"
        ) {
          aiRes = await api.get(
            "/analytics/ai-insights"
          );

          console.log(
            "AI RESPONSE",
            aiRes.data
          );
        }

        // ADVANCED ANALYTICS
        if (
          role === "ADMIN" ||
          role === "MANAGER" ||
          role === "FINANCE"
        ) {
          advancedRes = await api.get(
            "/analytics/advanced"
          );
        }

        let empData = [];
        let invData = [];

        if (
          role === "ADMIN" ||
          role === "HR" ||
          role === "MANAGER"
        ) {
          try {
            const empRes =
              await api.get("/employee");

            empData =
              empRes.data.data.data || [];

          } catch (err) {

            console.log(
              "Employee Access Denied"
            );
          }
        }
        if (
          role === "ADMIN" ||
          role === "SALES" ||
          role === "MANAGER"
        ) {
          try {

            const invRes =
              await api.get("/inventory");

            invData =
              invRes.data.data || [];

          } catch (err) {

            console.log(
              "Inventory Access Denied"
            );
          }
        }

        // SET DATA
        setAnalytics(
          analyticsRes.data.data
        );

        if (aiRes) {
          setAiInsights(
            aiRes.data.data
          );
        }

        if (advancedRes) {
          setAdvancedAnalytics(
            advancedRes.data.data
          );
        }

        setEmployees(empData);

        setInventory(invData);

        setTransactions(
          analyticsRes.data?.data
            ?.transactions || []
        );

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

        setRefreshing(false);

        setLastUpdated(
          new Date()
        );

        setIsFetching(false);

      }
    };

  // INITIAL LOAD + REALTIME SOCKET
  useEffect(() => {
    if (!role) return;
    fetchDashboard();
    // DASHBOARD REFRESH
    socket.on(

      "dashboard-refresh",

      () => {

        setLiveStatus(
          "Connected"
        );

        fetchDashboard(true);
      }
    );

    // INVENTORY
    socket.on(

      "inventory-updated",

      () => {

        fetchDashboard(true);
      }
    );

    // SALES
    socket.on(

      "sales-updated",

      () => {

        fetchDashboard(true);
      }
    );

    // FINANCE
    socket.on(

      "finance-updated",

      () => {

        fetchDashboard(true);
      }
    );

    socket.on(
      "connect",
      () => {

        setLiveStatus(
          "Connected"
        );
      }
    );

    socket.on(
      "disconnect",
      () => {

        setLiveStatus(
          "Disconnected"
        );
      }
    );

    return () => {

      socket.off("dashboard-refresh");
      socket.off("inventory-updated");
      socket.off("sales-updated");
      socket.off("finance-updated");
      socket.off("connect");
      socket.off("disconnect");
    };

  }, [role]);

  // MAIN ANALYTICS
  const totalEmployees =
    analytics?.employees || 0;

  const totalProducts =
    analytics?.inventory || 0;

  const income =
    analytics?.income || 0;

  const expense =
    analytics?.expense || 0;


  // LOW STOCK ITEMS
  const lowStockItems =
    inventory.filter(
      (i: any) =>

        Number(i.quantity) <=

        Number(
          i.reorderLevel || 5
        )
    );

  const aiCards =
    aiInsights?.data?.insights || [];

  const estimatedProfit =
    aiInsights?.data?.profit || 0;

  const procurementRecommendations =
    aiInsights?.data
      ?.procurementRecommendations || [];

  const aiPredictions =
    aiInsights?.data
      ?.predictions || [];

  const financialInsights =
    aiInsights?.data
      ?.financialInsights || [];

  const hrInsights =
    aiInsights?.data
      ?.hrInsights || [];

  const riskAlerts =
    aiInsights?.data
      ?.riskAlerts || [];

  const executiveSummary =
    aiInsights?.data
      ?.executiveSummary || "";

  const smartNotifications =
    aiInsights?.data
      ?.smartNotifications || [];

  const businessScore =
    aiInsights?.data
      ?.businessScore || 0;

  const businessStatus =
    aiInsights?.data
      ?.businessStatus || "Stable";

  const isAdmin = role === "ADMIN";
  const isHR = role === "HR";
  const isFinance = role === "FINANCE";
  const isSales = role === "SALES";
  const isManager = role === "MANAGER";
  const isEmployee = role === "EMPLOYEE";

  const kpiCards = [

    {
      title: "Employees",
      value: totalEmployees,
      icon: Users,
      path: "/employees",
      gradient:
        "from-blue-600 via-cyan-500 to-sky-400",
      subtitle: "12% workforce growth",
      badge: "+8 this month",
      roles: ["ADMIN", "HR", "MANAGER"],
    },

    {
      title: "Products",
      value: totalProducts,
      icon: Package,
      path: "/inventory",
      gradient:
        "from-violet-600 via-purple-500 to-pink-500",
      subtitle: "Inventory expansion",
      badge: "+15 SKUs",
      roles: ["ADMIN", "SALES", "MANAGER"],
    },

    {
      title: "Revenue",
      value: income,
      icon: DollarSign,
      path: "/finance",
      gradient:
        "from-emerald-600 via-green-500 to-teal-400",
      subtitle: "Revenue performance",
      prefix: "₹",
      badge: "+18%",
      roles: ["ADMIN", "FINANCE", "MANAGER"],
    },

    {
      title: "Expenses",
      value: expense,
      icon: TrendingUp,
      path: "/finance",
      gradient:
        "from-orange-500 via-red-500 to-rose-500",
      subtitle: "Operational spending",
      prefix: "₹",
      badge: "-4%",
      roles: ["ADMIN", "FINANCE", "MANAGER"],
    },

  ];

  // FINANCE BAR CHART
  const financeData = [
    {
      name: "Income",
      amount: income,
    },
    {
      name: "Expense",
      amount: expense,
    },
  ];

  // INVENTORY PIE CHART
  const stockData = [
    {
      name: "Low Stock",
      value: lowStockItems.length,
    },
    {
      name: "Healthy",
      value:
        totalProducts -
        lowStockItems.length,
    },
  ];

  // REAL BACKEND ANALYTICS
  const monthlyRevenueData =
    advancedAnalytics
      ?.monthlyRevenueData || [];

  const expenseTrendData =
    advancedAnalytics
      ?.expenseTrendData || [];

  const inventoryDistribution =
    advancedAnalytics
      ?.inventoryDistribution || [];

  const yearlyGrowth =
    advancedAnalytics
      ?.yearlyGrowth || [];

  // HEATMAP
  const heatmapOption = {

    tooltip: {},
    grid: {
      top: 40,
      left: 40,
      right: 20,
      bottom: 60,
    },

    xAxis: {
      type: "category",
      data: [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
      ],
    },

    yAxis: {
      type: "category",
      data: [
        "HR",
        "Sales",
        "Finance",
        "Inventory",
      ],
    },

    visualMap: {

      min: 0,

      max: 10,

      calculable: true,

      orient: "horizontal",

      left: "center",

      bottom: 0,
    },

    series: [

      {
        type: "heatmap",

        data: [

          [0, 0, 5],
          [1, 0, 2],
          [2, 0, 8],
          [3, 0, 6],

          [0, 1, 9],
          [1, 1, 4],
          [2, 1, 7],
          [3, 1, 5],

          [0, 2, 3],
          [1, 2, 8],
          [2, 2, 4],
          [3, 2, 6],
        ],
      },
    ],
  };

  // FUNNEL
  const chartReady =
    useMemo(() => true, []);
  const funnelOption = {

    tooltip: {

      trigger: "item",
    },

    series: [

      {
        type: "funnel",

        left: "10%",

        top: 20,

        bottom: 20,

        width: "80%",

        data: [

          {
            value: 100,
            name: "Leads",
          },

          {
            value: 80,
            name: "Qualified",
          },

          {
            value: 60,
            name: "Proposal",
          },

          {
            value: 40,
            name: "Negotiation",
          },

          {
            value: 20,
            name: "Closed",
          },
        ],
      },
    ],
  };

  // SCHEDULE REPORT

  if (loading || !role) {

    return (

      <AuthGuard>

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">

          <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[32px] px-10 py-8 flex flex-col items-center">

            <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-5"></div>

            <h2 className="text-2xl font-bold text-[#111827]">
              Loading Dashboard
            </h2>

            <p className="text-gray-500 mt-2 text-sm">
              Fetching ERP analytics and AI insights...
            </p>

          </div>

        </div>

      </AuthGuard>
    );
  }

  return (

    <AuthGuard>

      <div className="flex bg-[radial-gradient(circle_at_top_left,_#dbeafe,_transparent_25%),radial-gradient(circle_at_bottom_right,_#ede9fe,_transparent_25%),linear-gradient(to_bottom_right,#f8fafc,#eef2ff,#f5f3ff)] min-h-screen">
        <Sidebar />
        <div className="relative z-10 lg:ml-72 w-full px-4 sm:px-6 xl:px-8 py-6 sm:py-7 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out overflow-x-hidden">
          {/* BACKGROUND EFFECTS */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 blur-3xl rounded-full"></div>

          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-400/10 blur-3xl rounded-full"></div>
          {/* HEADER */}
          <div className="relative overflow-hidden bg-white/75 backdrop-blur-2xl border border-white/50 shadow-[0_20px_70px_rgba(0,0,0,0.08)] rounded-[36px] p-6 xl:p-7 mb-10">

            {/* PREMIUM OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-cyan-50/30 pointer-events-none"></div>

            {/* GLOW EFFECTS */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl"></div>

            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl"></div>

            {/* TOP PREMIUM BORDER */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500"></div>

            {/* CONTENT */}
            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

              {/* LEFT SIDE */}
              <div className="flex-1 max-w-3xl">

                {/* TITLE ROW */}
                <div className="flex items-start gap-4">

                  {/* ICON */}
                  <div className="relative">

                    <div className="absolute inset-0 bg-cyan-500/30 blur-2xl rounded-full"></div>

                    <div className="relative bg-gradient-to-br from-blue-600 via-cyan-500 to-sky-400 text-white p-4 rounded-[28px] shadow-[0_15px_35px_rgba(37,99,235,0.35)] border border-white/20">

                      <TrendingUp size={30} />

                    </div>

                  </div>

                  {/* TITLE CONTENT */}
                  <div>

                    <p className="text-sm uppercase tracking-[0.30em] text-blue-600 font-bold">
                      Enterprise ERP
                    </p>

                    <h1 className="text-4xl sm:text-5xl xl:text-[56px] font-black text-[#0f172a] tracking-tight leading-[0.95] mt-2">
                      Dashboard
                    </h1>

                    {/* PREMIUM TAGS */}
                    <div className="flex flex-wrap items-center gap-3 mt-4">

                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">

                        LIVE ANALYTICS

                      </div>

                      <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">

                        AI POWERED

                      </div>

                      <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide hidden sm:flex">

                        REAL-TIME ERP

                      </div>

                    </div>

                  </div>

                </div>

                {/* DESCRIPTION */}
                <p className="text-gray-600 text-[17px] leading-relaxed max-w-2xl mt-6">
                  Monitor employees, finance, inventory, forecasting,
                  analytics and AI business intelligence from one unified ERP platform.
                </p>

                {/* STATUS SECTION */}
                <div className="flex flex-wrap items-center gap-3 mt-6">

                  {/* LIVE STATUS */}
                  <div className="flex items-center gap-2 bg-emerald-100/80 backdrop-blur-xl text-emerald-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-emerald-200 shadow-sm">

                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>

                    {liveStatus}

                  </div>

                  {/* REFRESH */}
                  <button
                    onClick={() => fetchDashboard(true)}
                    className="group flex items-center gap-2 bg-blue-100/80 hover:bg-blue-200 text-blue-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-blue-200 shadow-sm transition-all duration-300 hover:scale-[1.03]"
                  >

                    <RefreshCw
                      size={16}
                      className={`${refreshing ? "animate-spin" : ""
                        } transition-all duration-300`}
                    />

                    {refreshing
                      ? "Refreshing..."
                      : "Refresh Data"}

                  </button>

                  {/* AI STATUS */}
                  <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 text-violet-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-violet-200 shadow-sm">

                    AI Analytics Enabled

                  </div>

                  {/* LAST UPDATE */}
                  <div className="hidden xl:flex items-center gap-2 bg-orange-100/80 backdrop-blur-xl text-orange-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-orange-200 shadow-sm">

                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>

                    Last Update:

                    {lastUpdated.toLocaleTimeString()}

                  </div>

                </div>

              </div>

              {/* RIGHT SIDE ACTIONS */}
              <div className="flex flex-row xl:flex-col gap-4 xl:min-w-[190px]">

                {/* PDF BUTTON */}
                <button
                  onClick={() =>
                    exportDashboardPDF(
                      employees,
                      inventory,
                      transactions,
                      analytics
                    )
                  }
                  className="group relative overflow-hidden flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-white px-5 py-3 rounded-[22px] shadow-[0_12px_30px_rgba(244,63,94,0.35)] hover:shadow-[0_18px_40px_rgba(244,63,94,0.45)] hover:-translate-y-1 transition-all duration-300 text-sm font-semibold w-full xl:min-w-[170px]"
                >

                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                  <Download size={17} className="relative z-10" />

                  <span className="relative z-10">
                    Export PDF
                  </span>

                </button>

                {/* EXCEL BUTTON */}
                <button
                  onClick={() =>
                    exportDashboardExcel(
                      employees,
                      inventory,
                      transactions
                    )
                  }
                  className="group relative overflow-hidden flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white px-5 py-3 rounded-[22px] shadow-[0_12px_30px_rgba(16,185,129,0.35)] hover:shadow-[0_18px_40px_rgba(16,185,129,0.45)] hover:-translate-y-1 transition-all duration-300 text-sm font-semibold w-full xl:min-w-[170px]"
                >

                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                  <Download size={17} className="relative z-10" />

                  <span className="relative z-10">
                    Export Excel
                  </span>

                </button>

              </div>

            </div>

          </div>
          {/* HEADER END */}


          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-10">





            {kpiCards
              .filter(card =>
                card.roles.includes(role)
              )
              .map((card, index) => {

                const Icon = card.icon;

                return (

                  <div
                    key={index}

                    onClick={() => {

                      if (
                        card.roles.includes(role)
                      ) {

                        router.push(card.path);

                      }

                    }}

                    className={`group relative overflow-hidden rounded-[32px] bg-gradient-to-br ${card.gradient} p-[1px] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer`}
                  >
                    {/* INNER CARD */}
                    <div className="relative h-full rounded-[31px] bg-white/10 backdrop-blur-xl px-7 py-6 overflow-hidden">

                      {/* GLOW */}
                      <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/20 rounded-full blur-3xl"></div>

                      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/10 to-transparent"></div>

                      {/* TOP */}
                      <div className="flex items-start justify-between relative z-10">

                        <div>

                          <p className="text-white text-sm font-semibold tracking-wide">
                            {card.title}
                          </p>

                          <h2 className="text-[26px] sm:text-[32px] xl:text-[48px] font-black text-white mt-3 leading-none tracking-tight">

                            {card.prefix}

                            <CountUp
                              end={card.value}
                              duration={2}
                            />

                          </h2>

                        </div>

                        {/* ICON */}
                        <div className="bg-white/15 backdrop-blur-2xl border border-white/10 p-4 rounded-3xl group-hover:scale-110 transition-all duration-500">

                          <Icon
                            size={30}
                            className="text-white"
                          />

                        </div>

                      </div>

                      {/* BOTTOM */}
                      <div className="relative z-10 mt-8 flex items-center justify-between">

                        <div>

                          <p className="text-sm text-white">
                            {card.subtitle}
                          </p>

                        </div>

                        <div className="bg-white/15 border border-white/10 px-3 py-1.5 rounded-full text-xs font-semibold text-white backdrop-blur-xl">

                          {card.badge}

                        </div>

                      </div>

                    </div>

                  </div>

                );
              })}
          </div>
          {/* ADVANCED ANALYTICS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 mb-10">

            {/* MONTHLY REVENUE */}

            {(
              isAdmin ||
              isFinance ||
              isManager
            ) && (
                <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] relative overflow-hidden p-7 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">

                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>

                  <div className="mb-6">

                    <h2 className="text-[22px] font-bold text-[#111827] tracking-tight">
                      Monthly Revenue
                    </h2>
                    <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                      Revenue performance overview
                    </p>

                  </div>

                  <ResponsiveContainer
                    width="100%"
                    height={220}
                  >

                    <LineChart
                      data={
                        monthlyRevenueData?.length
                          ? monthlyRevenueData
                          : [
                            { month: "Jan", revenue: 0 },
                            { month: "Feb", revenue: 0 }
                          ]
                      }
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e5e7eb"
                      />

                      <XAxis dataKey="month" />

                      <YAxis tick={{ fontSize: 12 }} />

                      <Tooltip
                        contentStyle={{
                          borderRadius: "20px",
                          border: "1px solid #e5e7eb",
                          boxShadow:
                            "0 15px 40px rgba(0,0,0,0.08)",
                          backgroundColor: "rgba(255,255,255,0.95)",
                        }}
                      />

                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#2563eb"
                        strokeWidth={4}
                        animationDuration={1500}
                      />

                    </LineChart>

                  </ResponsiveContainer>

                </div>

              )}

            {/* EXPENSE TREND */}
            {(
              isAdmin ||
              isFinance ||
              isManager
            ) && (
                <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] relative overflow-hidden p-7 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">

                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-400"></div>

                  <div className="mb-6">

                    <h2 className="text-[22px] font-bold text-[#111827] tracking-tight">
                      Expense Trends
                    </h2>

                    <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                      Monthly spending analytics
                    </p>

                  </div>

                  <ResponsiveContainer
                    width="100%"
                    height={220}
                  >

                    <AreaChart
                      data={
                        expenseTrendData?.length
                          ? expenseTrendData
                          : [
                            { month: "Jan", expense: 0 },
                            { month: "Feb", expense: 0 }
                          ]
                      }
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e5e7eb"
                      />

                      <XAxis dataKey="month" />

                      <YAxis tick={{ fontSize: 12 }} />

                      <Tooltip
                        contentStyle={{
                          borderRadius: "20px",
                          border: "1px solid #e5e7eb",
                          boxShadow:
                            "0 15px 40px rgba(0,0,0,0.08)",
                          backgroundColor: "rgba(255,255,255,0.95)",
                        }}
                      />

                      <Area
                        type="monotone"
                        dataKey="expense"
                        stroke="#ef4444"
                        fill="#fecaca"
                        animationDuration={1500}
                      />

                    </AreaChart>

                  </ResponsiveContainer>

                </div>
              )}

          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 mb-10">

            {/* FINANCE */}
            {(
              isAdmin ||
              isFinance ||
              isManager
            ) && (
                <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] relative overflow-hidden p-7 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">

                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>

                  <div className="mb-6">

                    <h2 className="text-[22px] font-bold text-[#111827] tracking-tight">
                      Finance Analytics
                    </h2>

                    <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                      Revenue vs expenses
                    </p>

                  </div>

                  <ResponsiveContainer
                    width="100%"
                    height={220}
                  >

                    <BarChart data={financeData}>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e5e7eb"
                      />

                      <XAxis dataKey="name" />

                      <YAxis tick={{ fontSize: 12 }} />

                      <Tooltip
                        contentStyle={{
                          borderRadius: "20px",
                          border: "1px solid #e5e7eb",
                          boxShadow:
                            "0 15px 40px rgba(0,0,0,0.08)",
                          backgroundColor: "rgba(255,255,255,0.95)",
                        }}
                      />

                      <Bar
                        dataKey="amount"
                        radius={[12, 12, 0, 0]}
                        fill="#2563eb"
                        animationDuration={1500}
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>
              )}

            {/* INVENTORY */}
            {(
              isAdmin ||
              isSales ||
              isManager
            ) && (
                <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] relative overflow-hidden p-7 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">

                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400"></div>

                  <div className="mb-6">

                    <h2 className="text-[22px] font-bold text-[#111827] tracking-tight">
                      Inventory Health
                    </h2>

                    <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                      Stock overview
                    </p>

                  </div>

                  <ResponsiveContainer
                    width="100%"
                    height={220}
                  >

                    <PieChart>
                      <Legend />

                      <Pie
                        data={stockData}
                        dataKey="value"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={5}
                        animationDuration={1500}
                      >

                        <Cell fill="#ef4444" />

                        <Cell fill="#22c55e" />

                      </Pie>

                      <Tooltip
                        contentStyle={{
                          borderRadius: "20px",
                          border: "1px solid #e5e7eb",
                          boxShadow:
                            "0 15px 40px rgba(0,0,0,0.08)",
                          backgroundColor: "rgba(255,255,255,0.95)",
                        }}
                      />

                    </PieChart>

                  </ResponsiveContainer>

                </div>
              )}

          </div>

          {/* SECOND ANALYTICS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 mb-10">

            {/* INVENTORY DISTRIBUTION */}
            {(
              isAdmin ||
              isSales ||
              isManager
            ) && (
                <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] relative overflow-hidden p-7 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">

                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-400"></div>

                  <div className="mb-6">

                    <h2 className="text-[22px] font-bold text-[#111827] tracking-tight">
                      Inventory Distribution
                    </h2>

                    <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                      Product category analytics
                    </p>

                  </div>

                  <ResponsiveContainer
                    width="100%"
                    height={220}
                  >

                    <PieChart>


                      <Pie
                        data={
                          inventoryDistribution?.length
                            ? inventoryDistribution
                            : [{ name: "No Data", value: 1 }]
                        }
                        dataKey="value"
                        outerRadius={110}
                        label
                      >
                        {(
                          inventoryDistribution?.length
                            ? inventoryDistribution
                            : [{ name: "No Data", value: 1 }]
                        ).map((item: any, index: number) => {

                          const colors = [
                            "#8b5cf6",
                            "#ec4899",
                            "#06b6d4",
                            "#22c55e",
                            "#f97316",
                            "#3b82f6",
                          ];

                          return (
                            <Cell
                              key={index}
                              fill={
                                colors[index % colors.length]
                              }
                            />
                          );
                        })}
                      </Pie>

                      <Tooltip
                        contentStyle={{
                          borderRadius: "20px",
                          border: "1px solid #e5e7eb",
                          boxShadow:
                            "0 15px 40px rgba(0,0,0,0.08)",
                          backgroundColor: "rgba(255,255,255,0.95)",
                        }}
                      />

                    </PieChart>

                  </ResponsiveContainer>

                </div>
              )}

            {/* YEARLY GROWTH */}
            {(
              isAdmin ||
              isFinance ||
              isManager
            ) && (
                <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] relative overflow-hidden p-7 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">

                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400"></div>

                  <div className="mb-6">

                    <h2 className="text-[22px] font-bold text-[#111827] tracking-tight">
                      Yearly Growth
                    </h2>

                    <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                      Business expansion analytics
                    </p>

                  </div>

                  <ResponsiveContainer
                    width="100%"
                    height={220}
                  >

                    <BarChart
                      data={
                        yearlyGrowth?.length
                          ? yearlyGrowth
                          : [
                            { year: "2025", growth: 0 }
                          ]
                      }
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e5e7eb"
                      />

                      <XAxis dataKey="year" />

                      <YAxis tick={{ fontSize: 12 }} />

                      <Tooltip
                        contentStyle={{
                          borderRadius: "20px",
                          border: "1px solid #e5e7eb",
                          boxShadow:
                            "0 15px 40px rgba(0,0,0,0.08)",
                          backgroundColor: "rgba(255,255,255,0.95)",
                        }}
                      />

                      <Bar
                        dataKey="growth"
                        fill="#22c55e"
                        radius={[12, 12, 0, 0]}
                        animationDuration={1500}
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>
              )}

          </div>
          {/* SCHEDULED REPORTS */}

          {/* ECHARTS */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">

            {/* HEATMAP */}
            <div className="relative overflow-hidden bg-white/80 backdrop-blur-2xl rounded-[32px] border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 p-7">

              {/* PREMIUM TOP BORDER */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"></div>

              {/* GLOW */}
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl"></div>

              {/* HEADER */}
              <div className="relative z-10 mb-6">

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="text-[22px] font-bold tracking-tight text-[#111827]">
                      Utilization Heatmap
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Department performance intensity
                    </p>

                  </div>

                  <div className="bg-cyan-100 text-cyan-700 text-xs font-semibold px-3 py-1 rounded-full">
                    LIVE
                  </div>

                </div>

              </div>

              {/* CHART */}
              {chartReady && (
                <ReactECharts
                  option={heatmapOption}
                  notMerge={true}
                  lazyUpdate={true}
                  style={{
                    height: "300px",
                    width: "100%",
                  }}
                />
              )}

            </div>

            {/* FUNNEL */}
            <div className="relative overflow-hidden bg-white/80 backdrop-blur-2xl rounded-[32px] border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 p-7">

              {/* PREMIUM TOP BORDER */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500"></div>

              {/* GLOW */}
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-fuchsia-400/20 rounded-full blur-3xl"></div>

              {/* HEADER */}
              <div className="relative z-10 mb-6">

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="text-[22px] font-bold tracking-tight text-[#111827]">
                      Sales Funnel
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      CRM conversion pipeline
                    </p>

                  </div>

                  <div className="bg-fuchsia-100 text-fuchsia-700 text-xs font-semibold px-3 py-1 rounded-full">
                    ANALYTICS
                  </div>

                </div>

              </div>

              {/* CHART */}
              {chartReady && (
                <ReactECharts
                  option={funnelOption}
                  notMerge={true}
                  lazyUpdate={true}
                  style={{
                    height: "300px",
                    width: "100%",
                  }}
                />
              )}

            </div>

          </div>
          {/* LOWER SECTION */}
          <div className="space-y-8 mb-10">

            {/* AI BUSINESS SCORE */}
            <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white rounded-[32px] p-8 mb-10 shadow-2xl">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                <div>

                  <p className="uppercase tracking-[0.25em] text-xs font-bold text-green-100">
                    AI BUSINESS HEALTH SCORE
                  </p>

                  <h2 className="text-5xl font-black mt-4">

                    {businessScore}/100

                  </h2>

                  <p className="mt-4 text-green-100 leading-relaxed">

                    AI evaluated overall business operational performance.

                  </p>

                </div>

                <div className="bg-white/15 backdrop-blur-xl px-8 py-6 rounded-3xl border border-white/20">

                  <p className="text-sm text-green-100">
                    Enterprise Status
                  </p>

                  <h2 className="text-3xl font-black mt-2">

                    {businessStatus}

                  </h2>

                </div>

              </div>

            </div>

            {/* AI EXECUTIVE SUMMARY */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 text-white rounded-[32px] p-8 mb-10 shadow-2xl overflow-hidden relative">

              <div className="absolute top-0 right-0 w-72 h-72 bg-fuchsia-500/20 blur-3xl rounded-full"></div>

              <div className="relative z-10">

                <p className="uppercase tracking-[0.25em] text-xs text-indigo-200 font-bold">
                  AI EXECUTIVE SUMMARY
                </p>

                <h2 className="text-3xl font-black mt-3">
                  Enterprise Business Overview
                </h2>

                <p className="text-indigo-100 leading-relaxed mt-5 max-w-4xl text-[15px]">

                  {executiveSummary}

                </p>

              </div>

            </div>

            {/* AI INSIGHTS */}
            <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] relative overflow-hidden shadow-lg border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-7 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">

              {/* TOP GRADIENT */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-red-500"></div>

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-5">

                <div>

                  <h2 className="text-[26px] sm:text-[32px] font-bold tracking-tight text-[#111827]">
                    AI Business Insights
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Smart ERP analytics and recommendations
                  </p>

                </div>

                {/* PROFIT CARD */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500 text-white px-6 py-4 rounded-3xl shadow-xl min-w-[220px]">

                  <p className="text-xs text-indigo-100">
                    Estimated Profit
                  </p>

                  <h2 className="text-3xl font-bold mt-1">
                    ₹{estimatedProfit}
                  </h2>

                </div>

              </div>

              {/* INSIGHTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

                {aiCards.map(
                  (item: any, index: number) => (

                    <div
                      key={index}
                      className={`rounded-2xl p-4 border transition-all duration-300 hover:shadow-md

                        ${item.type === "warning"
                          ? "bg-yellow-50 border-yellow-200"
                          : item.type === "danger"
                            ? "bg-red-50 border-red-200"
                            : item.type === "success"
                              ? "bg-green-50 border-green-200"
                              : "bg-blue-50 border-blue-200"
                        }
                          `}
                    >

                      <h3 className="font-bold text-base text-[#111827] mb-2">
                        {item.title}
                      </h3>

                      <p className="text-sm text-gray-700 leading-relaxed">
                        {item.message}
                      </p>

                    </div>

                  ))
                }

              </div>

            </div>


            {/* AI FINANCIAL INTELLIGENCE */}
            {(
              (isAdmin ||
                isFinance ||
                isManager)
              &&
              financialInsights.length > 0
            ) && (
                <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] relative overflow-hidden shadow-lg border border-white/50 p-7 mb-10">

                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-red-500"></div>

                  <div className="flex items-center justify-between mb-6">

                    <div>

                      <h2 className="text-[28px] font-bold text-[#111827]">
                        AI Financial Intelligence
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        Smart financial analytics powered by AI
                      </p>

                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                    {financialInsights.map(
                      (item: any, index: number) => (

                        <div
                          key={index}
                          className={`rounded-3xl p-5 border

                         ${item.type === "success"
                              ? "bg-green-50 border-green-200"

                              : item.type === "warning"
                                ? "bg-yellow-50 border-yellow-200"

                                : item.type === "danger"
                                  ? "bg-red-50 border-red-200"

                                  : "bg-blue-50 border-blue-200"
                            }
                           `}
                        >

                          <div className="flex items-center justify-between">

                            <h3 className="font-bold text-lg text-[#111827]">

                              {item.title}

                            </h3>

                            <div className="text-lg text-blue-400 font-black">

                              {item.value}

                            </div>

                          </div>

                          <p className="text-sm text-gray-600 mt-4 leading-relaxed">

                            {item.message}

                          </p>

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

            {/* AI HR INTELLIGENCE */}
            {(
              (isAdmin ||
                isHR ||
                isManager)
              &&
              hrInsights.length > 0
            ) && (

                <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] relative overflow-hidden shadow-lg border border-white/50 p-7 mb-10">

                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-red-500"></div>

                  <div className="flex items-center justify-between mb-6">

                    <div>

                      <h2 className="text-[28px] font-bold text-[#111827]">
                        AI HR Intelligence
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        Smart workforce analytics powered by AI
                      </p>

                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                    {hrInsights.map(
                      (item: any, index: number) => (

                        <div
                          key={index}
                          className={`rounded-3xl p-5 border

                            ${item.type === "success"
                              ? "bg-green-50 border-green-200"

                              : item.type === "warning"
                                ? "bg-yellow-50 border-yellow-200"

                                : "bg-blue-50 border-blue-200"
                            }
                                      `}
                        >

                          <div className="flex items-center justify-between">

                            <h3 className="font-bold text-lg text-[#111827]">

                              {item.title}

                            </h3>

                            <div className="text-lg  text-blue-400 font-black">

                              {item.value}

                            </div>

                          </div>

                          <p className="text-sm text-gray-600 mt-4 leading-relaxed">

                            {item.message}

                          </p>

                        </div>
                      )
                    )}

                  </div>

                </div>

              )}


            {/* AI PREDICTIONS */}
            {aiPredictions.length > 0 && (
              <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] relative overflow-hidden shadow-lg border border-white/50 p-7 mb-10">

                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-red-500"></div>

                <h2 className="text-[28px] font-bold text-[#111827] mb-6">
                  AI Predictive Intelligence
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-10">

                  {aiPredictions.map(
                    (item: any, index: number) => (

                      <div
                        key={index}
                        className="rounded-3xl border border-blue-200 bg-blue-50 p-5"
                      >

                        <h3 className="font-bold text-lg text-[#111827]">
                          {item.title}
                        </h3>

                        <p className="text-sm text-gray-600 mt-3 leading-relaxed">

                          {item.prediction}

                        </p>

                        <div className="mt-5 inline-flex bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">

                          Confidence:
                          {item.confidence}

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

            {/* AI PROCUREMENT ENGINE */}
            <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] relative overflow-hidden shadow-lg border border-white/50 p-7 mb-10">

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-red-500"></div>
              <div className="flex items-center justify-between mb-6">

                <div>

                  <h2 className="text-[28px] font-bold text-[#111827]">
                    AI Procurement Engine
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Smart inventory replenishment powered by AI
                  </p>

                </div>

              </div>

              {procurementRecommendations.length === 0 ? (

                <div className="text-center py-10">

                  <h3 className="text-xl font-bold text-green-600">
                    Inventory Stable
                  </h3>

                  <p className="text-gray-500 mt-2">
                    AI detected no procurement risks.
                  </p>

                </div>

              ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                  {procurementRecommendations.map(
                    (item: any, index: number) => (

                      <div
                        key={index}
                        className="border border-orange-200 bg-orange-50 rounded-3xl p-5 hover:shadow-lg transition-all"
                      >

                        <div className="flex items-center justify-between mb-3">

                          <h3 className="font-bold text-lg text-[#111827]">
                            {item.productName}
                          </h3>

                          <span className={`text-xs px-3 py-1 rounded-full font-bold

                ${item.urgency === "HIGH"
                              ? "bg-red-500 text-white"
                              : "bg-orange-400 text-white"
                            }
              `}>

                            {item.urgency}

                          </span>

                        </div>

                        <div className="space-y-2 text-sm">

                          <p>
                            Current Stock:
                            <span className="font-bold ml-2">
                              {item.currentStock}
                            </span>
                          </p>

                          <p>
                            Sold Units:
                            <span className="font-bold ml-2">
                              {item.soldUnits}
                            </span>
                          </p>

                          <p>
                            Avg Demand:
                            <span className="font-bold ml-2">
                              {item.averageDemand}
                            </span>
                          </p>

                          <p>
                            Recommended Restock:
                            <span className="font-bold ml-2 text-orange-600">
                              {item.recommendedRestock}
                            </span>
                          </p>

                        </div>

                        <div className="mt-4 text-sm text-gray-600 leading-relaxed">

                          {item.aiReason}

                        </div>

                      </div>
                    )
                  )}

                </div>
              )}

            </div>


            {/* AI RISK ENGINE */}
            {riskAlerts.length > 0 && (
              <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] relative overflow-hidden shadow-lg border border-white/50 p-7 mb-10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-red-500"></div>

                <div className="flex items-center justify-between mb-6">

                  <div>

                    <h2 className="text-[28px] font-bold text-[#111827]">
                      AI Risk Detection Engine
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      AI powered enterprise business risk analysis
                    </p>

                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">

                  {riskAlerts.map(
                    (risk: any, index: number) => (

                      <div
                        key={index}
                        className={`rounded-3xl p-5 border

                      ${risk.level === "HIGH"

                            ? "bg-red-50 border-red-200"

                            : risk.level === "MEDIUM"

                              ? "bg-yellow-50 border-yellow-200"

                              : "bg-blue-50 border-blue-200"
                          }
                       `}
                      >

                        <div className="flex items-center justify-between">

                          <h3 className="font-bold text-lg text-[#111827]">

                            {risk.title}

                          </h3>

                          <div
                            className={`text-xs font-bold px-3 py-1 rounded-full

                          ${risk.level === "HIGH"

                                ? "bg-red-100 text-red-600"

                                : risk.level === "MEDIUM"

                                  ? "bg-yellow-100 text-yellow-700"

                                  : "bg-blue-100 text-blue-700"
                              }
                           `}
                          >

                            {risk.level}

                          </div>

                        </div>

                        <p className="text-sm text-gray-600 mt-4 leading-relaxed">

                          {risk.message}

                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

            {/* AI SMART NOTIFICATIONS */}
            {smartNotifications.length > 0 && (
              <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] relative overflow-hidden shadow-lg border border-white/50 p-7 mb-10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-red-500"></div>
                <div className="flex items-center justify-between mb-6">

                  <div>

                    <h2 className="text-[28px] font-bold text-[#111827]">
                      AI Smart Notifications
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      AI generated enterprise alerts
                    </p>

                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                  {smartNotifications.map(
                    (item: any, index: number) => (

                      <div
                        key={index}
                        className={`rounded-3xl p-5 border

                      ${item.type === "success"

                            ? "bg-green-50 border-green-200"

                            : item.type === "danger"

                              ? "bg-red-50 border-red-200"

                              : "bg-yellow-50 border-yellow-200"
                          }
                        `}
                      >

                        <h3 className="font-bold text-lg text-[#111827]">

                          {item.title}

                        </h3>

                        <p className="text-sm text-gray-600 mt-4 leading-relaxed">

                          {item.message}

                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

            {/* THREE COLUMN SECTION */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-7">

              {/* TRANSACTIONS */}
              {(
                isAdmin ||
                isFinance ||
                isManager
              ) && (
                  <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] relative overflow-hidden p-6 shadow-lg border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.06)] h-[420px] flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">

                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-400"></div>

                    <div className="flex items-center justify-between mb-4">

                      <div>

                        <h2 className="text-[26px] sm:text-[32px] font-bold tracking-tight text-[#111827]">
                          Transactions
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                          Recent financial activity
                        </p>

                      </div>

                      <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {transactions.length} total
                      </span>

                    </div>

                    <div className="space-y-4 overflow-y-auto scroll-smooth pr-2 flex-1 custom-scrollbar">

                      {transactions.length === 0 ? (

                        <div className="flex flex-col items-center justify-center h-full text-center">

                          <div className="w-16 h-16 rounded-3xl bg-indigo-100 flex items-center justify-center mb-4">

                            <DollarSign
                              size={28}
                              className="text-indigo-600"
                            />

                          </div>

                          <h3 className="font-bold text-lg text-[#111827]">
                            No Transactions
                          </h3>

                          <p className="text-sm text-gray-500 mt-2 max-w-[220px]">
                            Financial transactions will appear here once recorded.
                          </p>

                        </div>

                      ) : (

                        transactions.map((tx: any) => (

                          <div
                            key={tx.id}
                            className="flex items-center justify-between border border-gray-100 rounded-2xl px-4 py-3.5 hover:bg-gray-50 hover:shadow-md transition-all duration-300"
                          >

                            <div>

                              <p
                                className={
                                  tx.type === "INCOME"
                                    ? "text-green-600 font-semibold"
                                    : "text-red-500 font-semibold"
                                }
                              >
                                {tx.type}
                              </p>

                              <p className="text-sm text-gray-500 mt-1">
                                {tx.account?.name || "No Account"}
                              </p>

                            </div>

                            <div
                              className={
                                tx.type === "INCOME"
                                  ? "font-bold text-green-600 text-lg"
                                  : "font-bold text-red-500 text-lg"
                              }
                            >
                              ₹{tx.amount}
                            </div>

                          </div>

                        ))
                      )}

                    </div>

                  </div>
                )}

              {/* LOW STOCK */}
              <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] relative overflow-hidden p-6 shadow-lg border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.06)] h-[420px] flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">

                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-400"></div>

                <div className="flex items-center justify-between mb-4">

                  <div>

                    <h2 className="text-[26px] sm:text-[32px] font-bold tracking-tight text-[#111827]">
                      Low Stock
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Critical inventory alerts
                    </p>

                  </div>

                  <div className="bg-red-100 p-2 rounded-xl">

                    <AlertTriangle className="text-red-500" />

                  </div>

                </div>

                <div className="space-y-4 overflow-y-auto scroll-smooth pr-2 flex-1 custom-scrollbar">

                  {lowStockItems.length === 0 ? (

                    <div className="flex flex-col items-center justify-center h-full text-center">

                      <div className="w-16 h-16 rounded-3xl bg-green-100 flex items-center justify-center mb-4">

                        <Package
                          size={28}
                          className="text-green-600"
                        />

                      </div>

                      <h3 className="font-bold text-lg text-[#111827]">
                        Inventory Healthy
                      </h3>

                      <p className="text-sm text-gray-500 mt-2 max-w-[220px]">
                        No low stock products detected right now.
                      </p>

                    </div>

                  ) : (

                    lowStockItems.map((item: any) => (

                      <div
                        key={item.id}
                        className="flex items-center justify-between border border-gray-100 rounded-2xl px-4 py-3.5 hover:bg-gray-50 hover:shadow-md transition-all duration-300"
                      >

                        <div>

                          <p className="font-semibold text-[#111827]">
                            {item.productName}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            SKU: {item.sku}
                          </p>

                        </div>

                        <div className="bg-red-100 text-red-600 font-bold px-3 py-1 rounded-xl">
                          {item.quantity}
                        </div>

                      </div>

                    ))
                  )}

                </div>

              </div>

              {/* EMPLOYEE INSIGHTS */}
              {(
                isAdmin ||
                isHR ||
                isManager
              ) && (
                  <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] relative overflow-hidden p-6 shadow-lg border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.06)] h-[420px] flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">

                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400"></div>

                    <div className="flex items-center justify-between mb-4">

                      <div>

                        <h2 className="text-[26px] sm:text-[32px] font-bold tracking-tight text-[#111827]">
                          Employee Insights
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                          Salary overview
                        </p>

                      </div>

                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {employees.length} employees
                      </span>

                    </div>

                    <div className="space-y-4 overflow-y-auto scroll-smooth pr-2 flex-1 custom-scrollbar">

                      {employees.length === 0 ? (

                        <div className="flex flex-col items-center justify-center h-full text-center">

                          <div className="w-16 h-16 rounded-3xl bg-blue-100 flex items-center justify-center mb-4">

                            <Users
                              size={28}
                              className="text-blue-600"
                            />

                          </div>

                          <h3 className="font-bold text-lg text-[#111827]">
                            No Employees
                          </h3>

                          <p className="text-sm text-gray-500 mt-2 max-w-[220px]">
                            Employee records will appear here once added.
                          </p>

                        </div>

                      ) : (

                        employees.map((emp: any) => (

                          <div
                            key={emp.id}
                            className="flex items-center justify-between border border-gray-100 rounded-2xl px-4 py-3.5 hover:bg-gray-50 hover:shadow-md transition-all duration-300"
                          >

                            <div>

                              <p className="font-semibold text-[#111827]">
                                {emp.name}
                              </p>

                              <p className="text-sm text-gray-500 mt-1">
                                {emp.position}
                              </p>

                            </div>

                            <div className="text-right">

                              <p className="font-bold text-green-600 text-lg">
                                ₹{emp.salary}
                              </p>

                            </div>

                          </div>

                        ))
                      )}

                    </div>

                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
      <AIChatbot />
    </AuthGuard >
  );
}