"use client";

import Sidebar from "../../components/Sidebar";
import AuthGuard from "../../components/AuthGuard";

import { useEffect, useState } from "react";

import api from "../../lib/api";

import { toast } from "react-hot-toast";

import {
  FileSpreadsheet,
  Clock3,
  Mail,
  Activity,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Search,
  Sparkles,
} from "lucide-react";

export default function ReportsPage() {

  const [reports, setReports] =
    useState<any[]>([]);

  const [name, setName] =
    useState("");

  const [type, setType] =
    useState("FINANCE");

  const [frequency,
    setFrequency] =
    useState("WEEKLY");

  const [email, setEmail] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [role, setRole] =
    useState("");

  const [creating,
    setCreating] =
    useState(false);

  const [loading,
    setLoading] =
    useState(true);

  // FETCH REPORTS
  const fetchReports =
    async () => {

      try {

        setLoading(true);

        const res =
          await api.get(
            "/reports/history"
          );

        setReports(
          res.data.data || []
        );

      } catch (err) {

        console.log(err);

        toast.error(
          "Failed to load reports"
        );

      } finally {

        setLoading(false);

      }
    };

  useEffect(() => {

    if (!role) return;

    if (
      role === "ADMIN" ||
      role === "MANAGER" ||
      role === "FINANCE"
    ) {

      fetchReports();

    }

  }, [role]);

  useEffect(() => {

    const savedRole =
      localStorage.getItem("role");

    if (savedRole) {

      setRole(savedRole);
    }

  }, []);

  // CREATE REPORT
  const createReport =
    async () => {

      if (
        !name.trim() ||
        !email.trim()
      ) {

        return toast.error(
          "Please fill all fields"
        );
      }

      const emailRegex =
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

      if (
        !emailRegex.test(email)
      ) {

        return toast.error(
          "Invalid email address"
        );
      }

      try {

        setCreating(true);

        await api.post(
          "/reports",

          {
            name: name.trim(),
            type,
            frequency,
            email:
              email
                .trim()
                .toLowerCase(),
          }
        );

        toast.success(
          "Report Scheduled Successfully ✅"
        );

        setName("");

        setType("FINANCE");

        setFrequency("WEEKLY");

        setEmail("");

        await fetchReports();

      } catch (err) {

        console.log(err);

        toast.error(
          "Failed to schedule report"
        );

      } finally {

        setCreating(false);

      }
    };

  // STATUS STYLE
  const getStatusStyle =
    (status: string) => {

      switch (status) {

        case "SENT":

          return "bg-green-100 text-green-700 border border-green-200";

        case "FAILED":

          return "bg-red-100 text-red-700 border border-red-200";

        default:

          return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      }
    };

  // FILTER REPORTS
  const filteredReports =
    reports.filter(
      (report: any) =>

        (
          report?.name || ""
        )
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        (
          report?.type || ""
        )
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );


  if (
    role &&
    role !== "ADMIN" &&
    role !== "MANAGER" &&
    role !== "FINANCE"
  ) {

    return (

      <AuthGuard>

        <div className="flex">

          <Sidebar />

          <div className="ml-72 min-h-screen flex items-center justify-center w-full">

            <div className="bg-white p-10 rounded-3xl shadow-xl text-center">

              <h2 className="text-3xl font-bold text-red-600">

                Access Denied

              </h2>

              <p className="mt-4 text-gray-500">

                You do not have permission
                to access Reports.

              </p>

            </div>

          </div>

        </div>

      </AuthGuard>

    );

  }



  return (

    <AuthGuard>

      <div className="flex">

        <Sidebar />

        <div className="ml-72 w-full min-h-screen bg-[#eef2f7] text-black p-10">

          {/* HEADER */}
          <div className="relative overflow-hidden bg-white/75 backdrop-blur-2xl border border-white/50 shadow-[0_20px_70px_rgba(0,0,0,0.08)] rounded-[36px] p-6 xl:p-7 mb-10">

            {/* PREMIUM OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-cyan-50/30 pointer-events-none"></div>

            {/* GLOW EFFECTS */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl"></div>

            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>

            {/* TOP BORDER */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"></div>

            {/* CONTENT */}
            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

              {/* LEFT */}
              <div className="flex-1 max-w-3xl">

                {/* TITLE */}
                <div className="flex items-start gap-4">

                  {/* ICON */}
                  <div className="relative">

                    <div className="absolute inset-0 bg-cyan-500/30 blur-2xl rounded-full"></div>

                    <div className="relative bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 text-white p-4 rounded-[28px] shadow-[0_15px_35px_rgba(59,130,246,0.35)] border border-white/20">

                      <FileSpreadsheet size={30} />

                    </div>

                  </div>

                  {/* TEXT */}
                  <div>

                    <p className="text-sm uppercase tracking-[0.30em] text-cyan-600 font-bold">

                      Enterprise ERP

                    </p>

                    <h1 className="text-4xl sm:text-5xl xl:text-[56px] font-black text-[#0f172a] tracking-tight leading-[0.95] mt-2">

                      Reports
                      <br />
                      Dashboard

                    </h1>

                    {/* TAGS */}
                    <div className="flex flex-wrap items-center gap-3 mt-4">

                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">

                        REPORT AUTOMATION

                      </div>

                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">

                        EMAIL DELIVERY

                      </div>

                      <div className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide hidden sm:flex">

                        BUSINESS ANALYTICS

                      </div>

                    </div>

                  </div>

                </div>

                {/* DESCRIPTION */}
                <p className="text-gray-600 text-[17px] leading-relaxed max-w-2xl mt-6">

                  Automate enterprise finance, HR, inventory
                  and operational reports with intelligent
                  scheduling, analytics and realtime delivery.

                </p>

                {/* STATUS */}
                <div className="flex flex-wrap items-center gap-3 mt-6">

                  {/* ACTIVE */}
                  <div className="flex items-center gap-2 bg-emerald-100/80 backdrop-blur-xl text-emerald-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-emerald-200 shadow-sm">

                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>

                    Reporting System Active

                  </div>

                  {/* ANALYTICS */}
                  <div className="bg-cyan-100/80 backdrop-blur-xl text-cyan-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-cyan-200 shadow-sm">

                    Live Analytics Enabled

                  </div>

                  {/* EMAIL */}
                  <div className="bg-indigo-100/80 backdrop-blur-xl text-indigo-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-indigo-200 shadow-sm">

                    Automated Email Delivery

                  </div>

                </div>

              </div>

              {/* RIGHT */}
              <div className="hidden xl:flex items-center justify-center">

                <div className="relative">

                  <div className="absolute inset-0 bg-cyan-400/20 blur-3xl rounded-full"></div>

                  <div className="relative w-52 h-52 rounded-full bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-white/30 backdrop-blur-2xl flex items-center justify-center">

                    <BarChart3
                      className="text-cyan-500"
                      size={90}
                    />

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* KPI SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-6 mb-10">

            {/* CARD 1 */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-[32px] p-7 shadow-xl">

              <div className="flex items-start justify-between">

                <div>

                  <p className="uppercase tracking-[3px] text-sm text-white/80 font-semibold">

                    Total Reports

                  </p>

                  <h2 className="text-6xl font-black mt-5">

                    {reports.length}

                  </h2>

                  <p className="mt-4 text-white/80">

                    Active reporting workflows

                  </p>

                </div>

                <div className="bg-white/20 p-4 rounded-2xl">

                  <FileSpreadsheet size={34} />

                </div>

              </div>

            </div>

            {/* CARD 2 */}
            <div className="bg-white border border-gray-200 rounded-[32px] p-7 shadow-xl">

              <div className="flex items-start justify-between">

                <div>

                  <p className="uppercase tracking-[3px] text-sm text-gray-500 font-semibold">

                    Scheduled

                  </p>

                  <h2 className="text-6xl font-black mt-5 text-[#111827]">

                    {
                      reports.filter(
                        (r: any) =>
                          r.status === "SCHEDULED"
                      ).length
                    }

                  </h2>

                  <p className="mt-4 text-gray-500">

                    Pending automation runs

                  </p>

                </div>

                <div className="bg-yellow-100 p-4 rounded-2xl">

                  <Clock3
                    className="text-yellow-600"
                    size={34}
                  />

                </div>

              </div>

            </div>

            {/* CARD 3 */}
            <div className="bg-white border border-gray-200 rounded-[32px] p-7 shadow-xl">

              <div className="flex items-start justify-between">

                <div>

                  <p className="uppercase tracking-[3px] text-sm text-gray-500 font-semibold">

                    Sent Reports

                  </p>

                  <h2 className="text-6xl font-black mt-5 text-green-600">

                    {
                      reports.filter(
                        (r: any) =>
                          r.status === "SENT"
                      ).length
                    }

                  </h2>

                  <p className="mt-4 text-gray-500">

                    Successfully delivered

                  </p>

                </div>

                <div className="bg-green-100 p-4 rounded-2xl">

                  <CheckCircle2
                    className="text-green-600"
                    size={34}
                  />

                </div>

              </div>

            </div>


            {/* CARD 4 */}

            <div className="bg-gradient-to-r from-purple-600 to-violet-500 text-white rounded-[32px] p-7 shadow-xl">

              <div className="flex items-start justify-between">

                <div>

                  <p className="uppercase tracking-[3px] text-sm text-white/80 font-semibold">

                    Email Targets

                  </p>

                  <h2 className="text-6xl font-black mt-5">

                    {reports.length}

                  </h2>

                  <p className="mt-4 text-white/80">

                    Scheduled recipients

                  </p>

                </div>

                <div className="bg-white/20 p-4 rounded-2xl">

                  <Mail size={34} />

                </div>

              </div>

            </div>

            <div className="bg-gradient-to-r from-red-600 to-rose-500 text-white rounded-[32px] p-7 shadow-xl">

              <div className="flex items-start justify-between">

                <div>

                  <p className="uppercase tracking-[3px] text-sm text-white/80 font-semibold">

                    Failed Reports

                  </p>

                  <h2 className="text-6xl font-black mt-5">

                    {
                      reports.filter(
                        (r: any) =>
                          r.status === "FAILED"
                      ).length
                    }

                  </h2>

                  <p className="mt-4 text-white/80">

                    Delivery failures detected

                  </p>

                </div>

                <div className="bg-white/20 p-4 rounded-2xl">

                  <AlertCircle size={34} />

                </div>

              </div>

            </div>

          </div>

          {/* MAIN CONTENT */}
          <div className="grid grid-cols-1 2xl:grid-cols-5 gap-8">

            {/* LEFT FORM */}
            {(
              role === "ADMIN" ||
              role === "MANAGER" ||
              role === "FINANCE"
            ) && (
                <div className="2xl:col-span-2">

                  <div className="bg-white rounded-[34px] border border-gray-200 shadow-xl p-8 sticky top-10">

                    <div className="flex items-center gap-4 mb-8">

                      <div className="bg-blue-100 p-4 rounded-2xl">

                        <Activity
                          className="text-blue-600"
                          size={28}
                        />

                      </div>

                      <div>

                        <h2 className="text-3xl font-bold">

                          Schedule Report

                        </h2>

                        <p className="text-gray-500 mt-1">

                          Configure enterprise automation workflows

                        </p>

                      </div>

                    </div>

                    <div className="space-y-6">

                      {/* REPORT NAME */}
                      <div>

                        <label className="text-sm font-semibold text-gray-600">

                          Report Name

                        </label>

                        <input
                          placeholder="Weekly Finance Summary"
                          className="w-full mt-3 border border-gray-300 bg-gray-50 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={name}
                          onChange={(e) =>
                            setName(
                              e.target.value
                            )
                          }
                        />

                      </div>

                      {/* TYPE */}
                      <div>

                        <label className="text-sm font-semibold text-gray-600">

                          Report Type

                        </label>

                        <select
                          className="w-full mt-3 border border-gray-300 bg-gray-50 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={type}
                          onChange={(e) =>
                            setType(
                              e.target.value
                            )
                          }
                        >

                          <option>
                            FINANCE
                          </option>

                          <option>
                            INVENTORY
                          </option>

                          <option>
                            HR
                          </option>

                          <option>
                            SALES
                          </option>

                        </select>

                      </div>

                      {/* FREQUENCY */}
                      <div>

                        <label className="text-sm font-semibold text-gray-600">

                          Frequency

                        </label>

                        <select
                          className="w-full mt-3 border border-gray-300 bg-gray-50 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={frequency}
                          onChange={(e) =>
                            setFrequency(
                              e.target.value
                            )
                          }
                        >

                          <option>
                            DAILY
                          </option>

                          <option>
                            WEEKLY
                          </option>

                          <option>
                            MONTHLY
                          </option>

                        </select>

                      </div>

                      {/* EMAIL */}
                      <div>

                        <label className="text-sm font-semibold text-gray-600">

                          Delivery Email

                        </label>

                        <input
                          placeholder="admin@company.com"
                          className="w-full mt-3 border border-gray-300 bg-gray-50 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={email}
                          onChange={(e) =>
                            setEmail(
                              e.target.value
                            )
                          }
                        />

                      </div>

                      {/* BUTTON */}
                      <button
                        disabled={creating}
                        onClick={() => {

                          const confirmed =
                            window.confirm(
                              "Schedule report?"
                            );

                          if (!confirmed) {
                            return;
                          }

                          createReport();

                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-[1.01] transition-all duration-300"
                      >

                        {
                          creating
                            ? "Scheduling..."
                            : "Schedule Enterprise Report"
                        }

                      </button>

                    </div>

                  </div>

                </div>
              )}

            {/* RIGHT HISTORY */}
            <div className="2xl:col-span-3">

              <div className="bg-white rounded-[34px] border border-gray-200 shadow-xl p-8">

                {/* TOP */}
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">

                  <div>

                    <h2 className="text-4xl font-black">

                      Report History

                    </h2>

                    <p className="text-gray-500 mt-2">

                      Monitor all automated reporting activity

                    </p>

                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">

                    <div className="relative">

                      <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />

                      <input
                        placeholder="Search reports..."
                        className="border border-gray-300 bg-gray-50 pl-12 pr-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-[280px]"
                        value={search}
                        onChange={(e) =>
                          setSearch(
                            e.target.value
                          )
                        }
                      />

                    </div>

                    <div className="bg-gray-100 px-5 py-4 rounded-2xl font-semibold text-gray-700">

                      {filteredReports.length} Reports

                    </div>

                  </div>

                </div>

                {/* LIST */}
                <div className="space-y-5 max-h-[850px] overflow-y-auto pr-2 custom-scrollbar">

                  {loading ? (

                    <div className="space-y-4">

                      <div className="h-32 bg-gray-100 rounded-3xl animate-pulse"></div>

                      <div className="h-32 bg-gray-100 rounded-3xl animate-pulse"></div>

                      <div className="h-32 bg-gray-100 rounded-3xl animate-pulse"></div>

                    </div>

                  ) : filteredReports.length === 0 ? (

                    <div className="flex flex-col items-center justify-center py-28 text-center">

                      <div className="bg-gray-100 p-7 rounded-full mb-6">

                        <AlertCircle
                          className="text-gray-400"
                          size={55}
                        />

                      </div>

                      <h3 className="text-3xl font-bold">

                        No Reports Scheduled

                      </h3>

                      <p className="text-gray-500 mt-4 max-w-md leading-relaxed">

                        Create your first enterprise reporting workflow
                        to automate ERP analytics and delivery.

                      </p>

                    </div>

                  ) : (

                    filteredReports.map(
                      (report: any) => (

                        <div
                          key={report.id}
                          className="group bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-[30px] p-7 hover:shadow-2xl hover:-translate-y-1 hover:border-blue-200 transition-all duration-300"
                        >

                          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-7">

                            {/* LEFT */}
                            <div className="flex items-start gap-5">

                              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white p-4 rounded-2xl shadow-lg">

                                <TrendingUp size={30} />

                              </div>

                              <div>

                                <h3 className="text-3xl font-bold">

                                  {report.name}

                                </h3>

                                {/* TAGS */}
                                <div className="flex flex-wrap gap-3 mt-5">

                                  <span className={`px-4 py-2 rounded-full text-sm font-bold

                                    ${report.type === "FINANCE"
                                      ? "bg-green-100 text-green-700"

                                      : report.type === "HR"
                                        ? "bg-purple-100 text-purple-700"

                                        : report.type === "INVENTORY"
                                          ? "bg-orange-100 text-orange-700"

                                          : "bg-blue-100 text-blue-700"
                                    }
                                  `}>

                                    {report.type}

                                  </span>

                                  <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold">

                                    {report.frequency}

                                  </span>

                                </div>

                                {/* META */}
                                <div className="mt-6 space-y-3">

                                  <p className="text-gray-500 flex items-center gap-3">

                                    <Mail size={17} />

                                    {report.email}

                                  </p>

                                  <p className="text-sm text-gray-400">

                                    Created:
                                    {" "}

                                    {


                                      new Date(
                                        report.createdAt
                                      ).toLocaleDateString()
                                    }

                                  </p>

                                </div>

                              </div>

                            </div>

                            {/* RIGHT */}
                            <div className="xl:text-right">

                              <span className={`px-5 py-3 rounded-full text-sm font-bold ${getStatusStyle(report.status)}`}>

                                {report.status}

                              </span>

                              <div className="mt-6">

                                <p className="text-sm text-gray-500">

                                  Last Run

                                </p>

                                <p className="font-bold text-lg mt-1">

                                  {
                                    report?.lastRun
                                      ? new Date(
                                        report.lastRun
                                      ).toLocaleDateString()

                                      : "Pending"
                                  }

                                </p>

                              </div>

                            </div>

                          </div>

                        </div>

                      ))
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 7px;
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