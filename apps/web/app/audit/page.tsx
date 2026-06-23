"use client";

import Sidebar from "../../components/Sidebar";
import AuthGuard from "../../components/AuthGuard";

import { useEffect, useState }
  from "react";

import api from "../../lib/api";

import { toast }
  from "react-hot-toast";

import {

  ShieldCheck,
  Activity,
  Search,
  Clock3,
  User,
  Database,
  FileText,

} from "lucide-react";

export default function AuditPage() {

  const [logs,
    setLogs] =
    useState<any[]>([]);

  const [search,
    setSearch] =
    useState("");

  const [loading,
    setLoading] =
    useState(true);

  // FETCH LOGS
  const fetchLogs =
    async () => {

      try {

        setLoading(true);

        const res =
          await api.get(
            "/audit"
          );

        setLogs(
          Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data.data)
              ? res.data.data
              : []
        );



      } catch (err) {

        if (
          process.env.NODE_ENV ===
          "development"
        ) {

          console.log(err);

        }

        toast.error(
          "Failed to load audit logs"
        );

      } finally {

        setLoading(false);

      }
    };

  useEffect(() => {

    fetchLogs();

  }, []);

  // FILTERED LOGS
  const filteredLogs =
    logs.filter(
      (log: any) =>

        log.module
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        log.userEmail ||
        log.user?.email
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        log.description
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  // MODULE COLORS
  const getModuleStyle =
    (module: string) => {

      switch (module) {

        case "FINANCE":

          return "bg-green-100 text-green-700";

        case "HR":

          return "bg-purple-100 text-purple-700";

        case "INVENTORY":

          return "bg-orange-100 text-orange-700";

        case "PROJECTS":

          return "bg-cyan-100 text-cyan-700";

        default:

          return "bg-blue-100 text-blue-700";
      }
    };

  // ACTION COLORS
  const getActionStyle =
    (action: string) => {

      switch (action) {

        case "DELETE":

          return "bg-red-100 text-red-700";

        case "UPDATE":

          return "bg-yellow-100 text-yellow-700";

        default:

          return "bg-green-100 text-green-700";
      }
    };

  return (

    <AuthGuard>

      <div className="flex">

        <Sidebar />

        <div className="ml-72 w-full min-h-screen bg-gradient-to-br from-gray-100 via-slate-100 to-gray-200 text-black p-10">

          {/* HEADER */}
          <div className="relative overflow-hidden bg-white/75 backdrop-blur-2xl border border-white/50 shadow-[0_20px_70px_rgba(0,0,0,0.08)] rounded-[36px] p-6 xl:p-7 mb-10">

            {/* PREMIUM OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-slate-50/40 pointer-events-none"></div>

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

                      <ShieldCheck size={30} />

                    </div>

                  </div>

                  {/* TEXT */}
                  <div>

                    <p className="text-sm uppercase tracking-[0.30em] text-cyan-600 font-bold">

                      Enterprise ERP

                    </p>

                    <h1 className="text-4xl sm:text-5xl xl:text-[56px] font-black text-[#0f172a] tracking-tight leading-[0.95] mt-2">

                      Audit Logs
                      <br />
                      Activity Center

                    </h1>

                    {/* TAGS */}
                    <div className="flex flex-wrap items-center gap-3 mt-4">

                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">

                        COMPLIANCE TRACKING

                      </div>

                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">

                        SECURITY EVENTS

                      </div>

                      <div className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide hidden sm:flex">

                        ENTERPRISE MONITORING

                      </div>

                    </div>

                  </div>

                </div>

                {/* DESCRIPTION */}
                <p className="text-gray-600 text-[17px] leading-relaxed max-w-2xl mt-6">

                  Monitor enterprise actions, workflow activity,
                  compliance operations and security events
                  across the entire ERP ecosystem in realtime.

                </p>

                {/* STATUS */}
                <div className="flex flex-wrap items-center gap-3 mt-6">

                  {/* LIVE */}
                  <div className="flex items-center gap-2 bg-emerald-100/80 backdrop-blur-xl text-emerald-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-emerald-200 shadow-sm">

                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>

                    Security Monitoring Active

                  </div>

                  {/* LOGS */}
                  <div className="bg-cyan-100/80 backdrop-blur-xl text-cyan-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-cyan-200 shadow-sm">

                    {logs.length} Activity Logs

                  </div>

                  {/* MODULES */}
                  <div className="bg-indigo-100/80 backdrop-blur-xl text-indigo-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-indigo-200 shadow-sm">

                    {
                      new Set(
                        logs
                          .filter(
                            (l: any) => l.module
                          )
                          .map(
                            (l: any) => l.module
                          )
                      ).size
                    }

                    {" "}Modules Active

                  </div>

                </div>

              </div>

              {/* RIGHT */}
              <div className="hidden xl:flex items-center justify-center">

                <div className="relative">

                  <div className="absolute inset-0 bg-cyan-400/20 blur-3xl rounded-full"></div>

                  <div className="relative w-52 h-52 rounded-full bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-white/30 backdrop-blur-2xl flex items-center justify-center">

                    <Activity
                      className="text-cyan-500"
                      size={90}
                    />

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ANALYTICS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

            <div className="bg-white rounded-[28px] p-7 shadow-lg border border-gray-200">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500 font-medium">
                    Total Activities
                  </p>

                  <h2 className="text-5xl font-bold mt-4">
                    {logs.length}
                  </h2>

                </div>

                <div className="bg-blue-100 p-4 rounded-2xl">

                  <Activity
                    className="text-blue-600"
                    size={32}
                  />

                </div>

              </div>

            </div>

            <div className="bg-white rounded-[28px] p-7 shadow-lg border border-gray-200">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500 font-medium">
                    Active Modules
                  </p>

                  <h2 className="text-5xl font-bold mt-4">

                    {
                      new Set(
                        logs.map(
                          (l: any) =>
                            l.module
                        )
                      ).size
                    }

                  </h2>

                </div>

                <div className="bg-purple-100 p-4 rounded-2xl">

                  <Database
                    className="text-purple-600"
                    size={32}
                  />

                </div>

              </div>

            </div>

            <div className="bg-white rounded-[28px] p-7 shadow-lg border border-gray-200">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500 font-medium">
                    Compliance Status
                  </p>

                  <h2 className="text-4xl font-bold mt-4 text-green-600">
                    Secure
                  </h2>

                </div>

                <div className="bg-green-100 p-4 rounded-2xl">

                  <ShieldCheck
                    className="text-green-600"
                    size={32}
                  />

                </div>

              </div>

            </div>

          </div>

          {/* SEARCH */}
          <div className="bg-white rounded-[28px] shadow-lg border border-gray-200 p-6 mb-8">

            <div className="relative">

              <Search
                className="absolute left-4 top-4 text-gray-400"
                size={20}
              />

              <input
                placeholder="Search audit logs..."
                className="w-full border border-gray-300 pl-12 pr-4 py-4 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

          </div>

          {/* LOGS */}
          <div className="bg-white rounded-[30px] shadow-xl border border-gray-200 p-8">

            <div className="flex items-center justify-between mb-8">

              <div>

                <h2 className="text-3xl font-bold">
                  Activity Timeline
                </h2>

                <p className="text-gray-500 mt-2">
                  Enterprise audit and compliance tracking
                </p>

              </div>

              <div className="bg-gray-100 px-5 py-3 rounded-2xl text-sm font-semibold text-gray-600">

                {filteredLogs.length} Logs

              </div>

            </div>

            <div className="space-y-5 max-h-[850px] overflow-y-auto pr-3 custom-scrollbar">

              {loading ? (

                <div className="py-20 text-center">

                  Loading Audit Logs...

                </div>

              ) :

                filteredLogs.length === 0 ? (


                  <div className="flex flex-col items-center justify-center py-24 text-center">

                    <div className="bg-gray-100 p-6 rounded-full mb-5">

                      <FileText
                        className="text-gray-400"
                        size={50}
                      />

                    </div>

                    <h3 className="text-2xl font-bold">
                      No Audit Logs Found
                    </h3>

                    <p className="text-gray-500 mt-3 max-w-md">
                      Enterprise activity logs will appear here automatically.
                    </p>

                  </div>

                ) : (

                  filteredLogs.map(
                    (log: any) => (

                      <div
                        key={log.id}
                        className="border border-gray-200 rounded-[28px] p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-white to-gray-50"
                      >

                        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                          {/* LEFT */}
                          <div className="flex items-start gap-5">

                            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white p-4 rounded-2xl shadow-lg">

                              <Activity size={28} />

                            </div>

                            <div>

                              <div className="flex flex-wrap gap-3 mb-4">

                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getModuleStyle(log.module)}`}>

                                  {log.module}

                                </span>

                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getActionStyle(log.action)}`}>

                                  {log.action}

                                </span>

                              </div>

                              <h3 className="text-2xl font-bold">

                                {log.description}

                              </h3>

                              <div className="mt-5 space-y-2">

                                <p className="text-gray-500 flex items-center gap-2">

                                  <User size={16} />

                                  {log.userEmail ||
                                    log.user?.email ||
                                    "System"}

                                </p>

                                <p className="text-gray-500 flex items-center gap-2">

                                  <Clock3 size={16} />

                                  {
                                    log.createdAt
                                      ? new Date(
                                        log.createdAt
                                      ).toLocaleString()
                                      : "-"
                                  }

                                </p>

                              </div>

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