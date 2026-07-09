"use client";
import Sidebar from "../components/Sidebar";
import AuthGuard from "../components/AuthGuard";
import AIChatbot
  from "../components/AIChatbot";
import socket from "../lib/socket";
import DashboardHeader
  from "../components/dashboard/DashboardHeader";
import KPICards
  from "../components/dashboard/KPICards";
import AdvancedCharts
  from "../components/dashboard/AdvancedCharts";
import BusinessScore
  from "../components/dashboard/BusinessScore";
import ExecutiveSummary
  from "../components/dashboard/ExecutiveSummary";
import AIInsights
  from "../components/dashboard/AIInsights";
import FinancialInsights
  from "../components/dashboard/FinancialInsights";
import HRInsights
  from "../components/dashboard/HRInsights";
import Predictions
  from "../components/dashboard/Predictions";
import Procurement
  from "../components/dashboard/Procurement";
import RiskAlerts
  from "../components/dashboard/RiskAlerts";
import SmartNotifications
  from "../components/dashboard/SmartNotifications";
import Transactions
  from "../components/dashboard/Transactions";
import LowStock
  from "../components/dashboard/LowStock";
import EmployeeInsights
  from "../components/dashboard/EmployeeInsights";
import HeatMap
  from "../components/dashboard/HeatMap";
import SalesFunnel
  from "../components/dashboard/SalesFunnel";
import {
  Users,
  Package,
  IndianRupee,
  TrendingUp,
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
  CartesianGrid,
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
import { exportDashboardPDF }
  from "../lib/exportPDF";

import { exportDashboardExcel }
  from "../lib/exportExcel";

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
            console.log("EMPLOYEE RESPONSE", empRes.data);

            const employeeData =
              empRes.data.data?.data ??
              empRes.data.data ??
              [];

            empData = Array.isArray(employeeData)
              ? employeeData
              : [];

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
          console.log("AI STATE", aiRes.data.data);
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
    Array.isArray(inventory)
      ? inventory.filter(
        (i: any) =>
          Number(i.quantity) <=
          Number(i.reorderLevel || 5)
      )
      : [];

  const aiCards =
    aiInsights?.insights || [];

  const estimatedProfit =
    aiInsights?.profit || 0;

  const procurementRecommendations =
    aiInsights?.procurementRecommendations || [];

  const aiPredictions =
    aiInsights?.predictions || [];

  const financialInsights =
    aiInsights?.financialInsights || [];

  const hrInsights =
    aiInsights?.hrInsights || [];

  const riskAlerts =
    aiInsights?.riskAlerts || [];

  const executiveSummary =
    aiInsights?.executiveSummary || "";

  const smartNotifications =
    aiInsights?.smartNotifications || [];

  const businessHealth =
    aiInsights?.businessHealth || 0;

  const businessScore =
    aiInsights?.businessScore || 0;

  const businessStatus =
    aiInsights?.businessStatus || "Stable";

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
      icon: IndianRupee,
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
          <DashboardHeader
            liveStatus={liveStatus}
            refreshing={refreshing}
            lastUpdated={lastUpdated}
            employees={employees}
            inventory={inventory}
            transactions={transactions}
            analytics={analytics}
            fetchDashboard={fetchDashboard}
            exportDashboardPDF={exportDashboardPDF}
            exportDashboardExcel={exportDashboardExcel}
          />
          {/* HEADER END */}

          {/* KPI CARDS */}
          <KPICards

            cards={kpiCards}

            role={role}

          />
          {/* ADVANCED ANALYTICS */}
          <AdvancedCharts

            monthlyRevenueData={monthlyRevenueData}

            expenseTrendData={expenseTrendData}

            isAdmin={isAdmin}

            isFinance={isFinance}

            isManager={isManager}

          />

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
            <HeatMap option={heatmapOption} />

            {/* FUNNEL */}
            <SalesFunnel option={funnelOption} />
          </div>
          {/* LOWER SECTION */}
          <div className="space-y-8 mb-10">

            {/* AI BUSINESS SCORE */}
            <BusinessScore

              businessHealth={businessHealth}

              businessStatus={businessStatus}

            />

            {/* AI EXECUTIVE SUMMARY */}
            <ExecutiveSummary

              executiveSummary={executiveSummary}

            />

            {/* AI INSIGHTS */}
            <AIInsights

              aiCards={aiCards}

              estimatedProfit={estimatedProfit}

            />


            {/* AI FINANCIAL INTELLIGENCE */}
            <FinancialInsights

              financialInsights={financialInsights}

              isAdmin={isAdmin}

              isFinance={isFinance}

              isManager={isManager}

            />
            {/* AI HR INTELLIGENCE */}
            <HRInsights

              hrInsights={hrInsights}

              isAdmin={isAdmin}

              isHR={isHR}

              isManager={isManager}

            />

            {/* AI PREDICTIONS */}
            <Predictions

              predictions={aiPredictions}

            />

            {/* AI PROCUREMENT ENGINE */}
            <Procurement

              procurementRecommendations={
                procurementRecommendations
              }

            />


            {/* AI RISK ENGINE */}
            <RiskAlerts

              riskAlerts={riskAlerts}

            />

            {/* AI SMART NOTIFICATIONS */}
            <SmartNotifications

              smartNotifications={smartNotifications}

            />

            {/* THREE COLUMN SECTION */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-7">

              {/* TRANSACTIONS */}
              <Transactions

                transactions={transactions}

                isAdmin={isAdmin}

                isFinance={isFinance}

                isManager={isManager}

              />

              {/* LOW STOCK */}
              <LowStock

                lowStockItems={lowStockItems}

              />

              {/* EMPLOYEE INSIGHTS */}
              <EmployeeInsights

                employees={employees}

                isAdmin={isAdmin}

                isHR={isHR}

                isManager={isManager}

              />
            </div>
          </div>
        </div>
      </div>
      <AIChatbot />
    </AuthGuard >
  );
}