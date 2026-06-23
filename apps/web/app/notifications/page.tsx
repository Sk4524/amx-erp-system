"use client";

import {
  useEffect,
  useState,
} from "react";

import Sidebar from "../../components/Sidebar";
import AuthGuard from "../../components/AuthGuard";

import api from "../../lib/api";

import toast from "react-hot-toast";
import socket
  from "../../lib/socket";

import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Brain,
  Trash2,
  Search,
  CheckCheck,
  XCircle,
  Sparkles,
  Activity,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function NotificationsPage() {

  const [notifications,
    setNotifications] =
    useState<any[]>([]);

  const [loading,
    setLoading] =
    useState(true);

  const [search,
    setSearch] =
    useState("");

  const [filter,
    setFilter] =
    useState("ALL");

  const [socketStatus,
    setSocketStatus] =
    useState("Connected");

  const [actionLoading,
    setActionLoading] =
    useState(false);

  const [processingId,
    setProcessingId] =
    useState("");


  // FETCH
  const fetchNotifications =
    async () => {

      try {

        const res =
          await api.get(
            "/notifications"
          );

        setNotifications(
          res.data.data || []
        );

      } catch (err) {

        console.log(err);

        toast.error(
          "Failed to load notifications"
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    fetchNotifications();

    const interval =
      setInterval(() => {

        fetchNotifications();

      }, 30000);

    return () =>
      clearInterval(
        interval
      );

  }, []);

  // SOCKET
  useEffect(() => {

    const handleConnect = () => {

      setSocketStatus(
        "Connected"
      );

    };

    const handleDisconnect = () => {

      setSocketStatus(
        "Disconnected"
      );

    };

    const handleNotification =
      (data: any) => {

        setNotifications(
          (prev) => [
            {
              ...data,
              id: data.id,
              isRead: false,
              createdAt: new Date(),
            },
            ...prev,
          ]
        );

        toast.success(
          data.title ||
          "New notification"
        );
      };

    socket.on(
      "connect",
      handleConnect
    );

    socket.on(
      "disconnect",
      handleDisconnect
    );

    socket.on(
      "notification",
      handleNotification
    );

    return () => {

      socket.off(
        "connect",
        handleConnect
      );

      socket.off(
        "disconnect",
        handleDisconnect
      );

      socket.off(
        "notification",
        handleNotification
      );

    };

  }, []);

  // MARK READ
  const markAsRead =
    async (id: string) => {

      try {

        setProcessingId(id);

        await api.put(
          `/notifications/${id}/read`
        );

        setNotifications(
          (prev: any) =>

            prev.map(
              (n: any) =>

                n.id === id

                  ? {
                    ...n,
                    isRead: true,
                  }

                  : n
            )
        );

        toast.success(
          "Marked as read"
        );

      } catch {

        toast.error(
          "Action failed"
        );
      } finally {

        setProcessingId("");

      }
    };

  // DELETE
  const deleteNotification =
    async (id: string) => {

      try {

        await api.delete(
          `/notifications/${id}`
        );

        setNotifications(
          (prev: any) =>

            prev.filter(
              (n: any) =>
                n.id !== id
            )
        );

        toast.success(
          "Notification deleted"
        );

      } catch {

        toast.error(
          "Delete failed"
        );
      }
    };

  // MARK ALL
  const markAllRead =
    async () => {

      try {

        setActionLoading(true);

        await Promise.all(

          notifications

            .filter(
              (n: any) =>
                !n.isRead
            )

            .map(
              (n: any) =>

                api.put(
                  `/notifications/${n.id}/read`
                )
            )
        );

        fetchNotifications();

        toast.success(
          "All notifications marked as read"
        );

      } catch {

        toast.error(
          "Action failed"
        );

      } finally {

        setActionLoading(false);
      }
    };

  // CLEAR ALL
  const clearAll =
    async () => {

      try {

        setActionLoading(true);

        await Promise.all(

          notifications.map(
            (n: any) =>

              api.delete(
                `/notifications/${n.id}`
              )
          )
        );

        setNotifications([]);

        toast.success(
          "All notifications cleared"
        );

      } catch {

        toast.error(
          "Action failed"
        );

      } finally {

        setActionLoading(false);
      }
    };

  // FILTER
  const filteredNotifications =
    notifications.filter(
      (item: any) => {

        const matchesSearch =

          (
            item.title || ""
          )
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )

          ||

          (
            item.message || ""
          )
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesFilter =

          filter === "ALL"

            ? true

            : filter === "UNREAD"

              ? !item.isRead

              : item.isRead;

        return (
          matchesSearch &&
          matchesFilter
        );
      }
    );

  // ICONS
  const getIcon =
    (type?: string) => {

      if (
        type?.includes("APPROVED")
      ) {

        return (
          <div className="bg-green-100 text-green-600 p-3 rounded-2xl">

            <CheckCircle size={22} />

          </div>
        );
      }

      if (
        type?.includes("REJECTED")
      ) {

        return (
          <div className="bg-red-100 text-red-600 p-3 rounded-2xl">

            <AlertTriangle size={22} />

          </div>
        );
      }

      if (
        type?.includes("AI")
      ) {

        return (
          <div className="bg-purple-100 text-purple-600 p-3 rounded-2xl">

            <Brain size={22} />

          </div>
        );
      }

      return (
        <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">

          <Bell size={22} />

        </div>
      );
    };

  return (

    <AuthGuard>

      <div className="flex">

        <Sidebar />

        <div className="ml-[290px] w-full min-h-screen bg-[#f6f9fc] p-8">

          {/* HEADER */}
          <div className="relative overflow-hidden bg-white/75 backdrop-blur-2xl border border-white/50 shadow-[0_20px_70px_rgba(0,0,0,0.08)] rounded-[36px] p-6 xl:p-7 mb-10">

            {/* PREMIUM OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-cyan-50/30 pointer-events-none"></div>

            {/* GLOW EFFECTS */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl"></div>

            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl"></div>

            {/* TOP BORDER */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500"></div>

            {/* CONTENT */}
            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

              {/* LEFT */}
              <div className="flex-1 max-w-3xl">

                {/* TITLE ROW */}
                <div className="flex items-start gap-4">

                  {/* ICON */}
                  <div className="relative">

                    <div className="absolute inset-0 bg-cyan-500/30 blur-2xl rounded-full"></div>

                    <div className="relative bg-gradient-to-br from-blue-600 via-cyan-500 to-sky-400 text-white p-4 rounded-[28px] shadow-[0_15px_35px_rgba(37,99,235,0.35)] border border-white/20">

                      <Bell size={30} />

                    </div>

                  </div>

                  {/* TEXT */}
                  <div>

                    <p className="text-sm uppercase tracking-[0.30em] text-blue-600 font-bold">

                      Enterprise ERP

                    </p>

                    <h1 className="text-4xl sm:text-5xl xl:text-[56px] font-black text-[#0f172a] tracking-tight leading-[0.95] mt-2">

                      Notifications

                    </h1>

                    <div className="mt-4 flex items-center gap-3">

                      <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">

                        {
                          notifications.filter(
                            (n: any) =>
                              !n.isRead
                          ).length
                        }

                        Unread

                      </div>

                    </div>

                    {/* TAGS */}
                    <div className="flex flex-wrap items-center gap-3 mt-4">

                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">

                        REALTIME ALERTS

                      </div>

                      <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">

                        LIVE EVENTS

                      </div>

                      <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide hidden sm:flex">

                        ENTERPRISE ACTIVITY

                      </div>

                    </div>

                  </div>

                </div>

                {/* DESCRIPTION */}
                <p className="text-gray-600 text-[17px] leading-relaxed max-w-2xl mt-6">

                  Monitor approvals, AI alerts, workflow activities,
                  realtime ERP notifications and operational events
                  across your enterprise infrastructure.

                </p>

                {/* STATUS */}
                <div className="flex flex-wrap items-center gap-3 mt-6">

                  {/* LIVE */}
                  <div className="flex items-center gap-2 bg-emerald-100/80 backdrop-blur-xl text-emerald-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-emerald-200 shadow-sm">

                    <div
                      className={`w-2.5 h-2.5 rounded-full ${socketStatus === "Connected"
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-red-500"
                        }`}
                    />
                    <span>

                      Socket:

                      {" "}

                      {socketStatus}

                    </span>

                  </div>

                  {/* TOTAL */}
                  <div className="bg-blue-100/80 backdrop-blur-xl text-blue-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-blue-200 shadow-sm">

                    {notifications.length} Total Notifications

                  </div>

                  {/* UNREAD */}
                  <div className="bg-orange-100/80 backdrop-blur-xl text-orange-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-orange-200 shadow-sm">

                    {
                      notifications.filter(
                        (n: any) => !n.isRead
                      ).length
                    }

                    {" "}Unread Alerts

                  </div>

                </div>

              </div>

              {/* RIGHT */}
              <div className="hidden xl:flex items-center justify-center">

                <div className="relative">

                  <div className="absolute inset-0 bg-cyan-400/20 blur-3xl rounded-full"></div>

                  <div className="relative w-52 h-52 rounded-full bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-violet-500/10 border border-white/30 backdrop-blur-2xl flex items-center justify-center">

                    <Sparkles
                      size={90}
                      className="text-cyan-500"
                    />

                  </div>

                </div>

              </div>

            </div>

          </div>
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

            {/* TOTAL */}
            <div className="relative overflow-hidden rounded-[30px] bg-white border border-slate-200 p-7 shadow-lg">

              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-blue-500/5 blur-3xl" />

              <div className="relative">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-slate-500 font-medium">
                      Total Alerts
                    </p>

                    <h2 className="text-5xl font-black text-slate-800 mt-4">

                      {notifications.length}

                    </h2>

                  </div>

                  <div className="bg-blue-100 text-blue-600 p-4 rounded-3xl">

                    <Bell size={28} />

                  </div>

                </div>

              </div>

            </div>

            {/* UNREAD */}
            <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-red-500 to-orange-400 text-white p-7 shadow-xl">

              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 blur-3xl" />

              <div className="relative flex items-center justify-between">

                <div>

                  <p className="text-white/80 font-medium">
                    Unread Alerts
                  </p>

                  <h2 className="text-5xl font-black mt-4">

                    {
                      notifications.filter(
                        (n: any) =>
                          !n.isRead
                      ).length
                    }

                  </h2>

                </div>

                <div className="bg-white/15 p-4 rounded-3xl">

                  <Activity size={28} />

                </div>

              </div>

            </div>

            {/* READ */}
            <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-green-500 to-emerald-400 text-white p-7 shadow-xl">

              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 blur-3xl" />

              <div className="relative flex items-center justify-between">

                <div>

                  <p className="text-white/80 font-medium">
                    Processed
                  </p>

                  <h2 className="text-5xl font-black mt-4">

                    {
                      notifications.filter(
                        (n: any) =>
                          n.isRead
                      ).length
                    }

                  </h2>

                </div>

                <div className="bg-white/15 p-4 rounded-3xl">

                  <CheckCheck size={28} />

                </div>

              </div>

            </div>

            {/* STATUS */}
            <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-indigo-600 to-purple-500 text-white p-7 shadow-xl">

              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 blur-3xl" />

              <div className="relative flex items-center justify-between">

                <div>

                  <p className="text-white/80 font-medium">
                    System Status
                  </p>

                  <h2 className="text-3xl font-black mt-5">

                    ACTIVE

                  </h2>

                </div>

                <div className="bg-white/15 p-4 rounded-3xl">

                  <ShieldCheck size={28} />

                </div>

              </div>

            </div>

          </div>

          {/* MAIN CONTAINER */}
          <div className="bg-white rounded-[38px] border border-slate-200 shadow-xl overflow-hidden">

            {/* TOPBAR */}
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-7 py-6">

              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

                {/* LEFT */}
                <div>

                  <h2 className="text-3xl font-black text-slate-800">

                    Activity Feed

                  </h2>

                  <p className="text-slate-500 mt-2">

                    Realtime enterprise notification management

                  </p>

                </div>

                {/* RIGHT */}
                <div className="flex flex-wrap gap-3">

                  {/* SEARCH */}
                  <div className="relative">

                    <Search
                      size={18}
                      className="absolute left-4 top-4 text-slate-400"
                    />

                    <input
                      placeholder="Search..."
                      className="pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-[260px]"
                      value={search}
                      onChange={(e) =>
                        setSearch(
                          e.target.value
                        )
                      }
                    />

                  </div>

                  {/* FILTER */}
                  <div className="flex items-center bg-slate-100 rounded-2xl p-1">

                    {[
                      "ALL",
                      "UNREAD",
                      "READ",
                    ].map((item) => (

                      <button
                        key={item}
                        onClick={() =>
                          setFilter(item)
                        }
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all

                        ${filter === item

                            ? "bg-blue-600 text-white shadow-lg"

                            : "text-slate-600 hover:bg-white"
                          }
                        `}
                      >

                        {item}

                      </button>

                    ))}

                  </div>

                  {/* MARK ALL */}
                  <button
                    disabled={actionLoading}
                    onClick={markAllRead}
                    className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-2xl hover:bg-green-700 transition-all shadow-lg disabled:opacity-50"
                  >

                    <CheckCheck size={18} />

                    {
                      actionLoading
                        ? "Processing..."
                        : "Mark All"
                    }

                  </button>

                  {/* CLEAR */}
                  <button
                    disabled={actionLoading}
                    onClick={() => {

                      const confirmed =
                        window.confirm(
                          "Delete all notifications?"
                        );

                      if (!confirmed)
                        return;

                      clearAll();
                    }}
                    className="flex items-center gap-2 bg-red-500 text-white px-5 py-3 rounded-2xl hover:bg-red-600 transition-all shadow-lg disabled:opacity-50"
                  >

                    <XCircle size={18} />

                    {
                      actionLoading
                        ? "Processing..."
                        : "Clear"
                    }

                  </button>

                </div>

              </div>

            </div>

            {/* BODY */}
            <div className="p-7">

              {loading ? (

                <div className="flex flex-col items-center justify-center py-28">

                  <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />

                  <p className="text-slate-500 mt-6">

                    Loading notifications...

                  </p>

                </div>

              ) : filteredNotifications.length === 0 ? (

                <div className="flex flex-col items-center justify-center py-28 text-center">

                  <div className="bg-slate-100 p-7 rounded-full mb-6">

                    <Bell
                      size={54}
                      className="text-slate-400"
                    />

                  </div>

                  <h3 className="text-3xl font-black text-slate-800">

                    No Notifications

                  </h3>

                  <p className="text-slate-500 mt-3 max-w-md leading-relaxed">

                    Enterprise alerts and workflow activities
                    will appear here once generated.

                  </p>

                </div>

              ) : (

                <div className="space-y-5">

                  {filteredNotifications.map(
                    (item: any) => (

                      <div
                        key={item.id}
                        className={`group relative overflow-hidden rounded-[30px] border p-6 transition-all duration-300 hover:shadow-xl

                        ${item.isRead

                            ? "bg-white border-slate-200"

                            : "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200"
                          }
                        `}
                      >

                        {/* GLOW */}
                        {!item.isRead && (

                          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-blue-500/5 blur-3xl" />

                        )}

                        <div className="relative flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">

                          {/* LEFT */}
                          <div className="flex items-start gap-5">

                            {getIcon(item.type)}

                            <div>

                              <div className="flex items-center gap-3 flex-wrap">

                                <h3 className="font-bold text-xl text-slate-800">

                                  {item.title || "Notification"}

                                </h3>

                                {!item.isRead && (

                                  <div className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold shadow-lg">

                                    NEW

                                  </div>

                                )}

                              </div>

                              <p className="text-slate-600 mt-3 leading-relaxed text-[15px]">

                                {item.message ||
                                  "No message available"}

                              </p>

                              <div className="flex items-center gap-3 mt-5">

                                <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">

                                  {
                                    item.type ||
                                    "SYSTEM"
                                  }

                                </div>

                                <p className="text-xs text-slate-400">

                                  {
                                    item.createdAt
                                      ? new Date(
                                        item.createdAt
                                      ).toLocaleString()
                                      : "N/A"
                                  }

                                </p>

                              </div>

                            </div>

                          </div>

                          {/* ACTIONS */}
                          <div className="flex items-center gap-3">

                            {!item.isRead && (

                              <button
                                disabled={
                                  processingId === item.id
                                }

                                onClick={() =>
                                  markAsRead(
                                    item.id
                                  )
                                }
                                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg"
                              >

                                <Zap size={16} />

                                {
                                  processingId === item.id
                                    ? "Loading..."
                                    : "Mark Read"
                                }

                              </button>

                            )}

                            <button
                              onClick={() => {

                                const confirmed =
                                  window.confirm(
                                    "Delete notification?"
                                  );

                                if (!confirmed)
                                  return;

                                deleteNotification(
                                  item.id
                                );
                              }}
                              className="p-3 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 transition-all"
                            >

                              <Trash2 size={18} />

                            </button>

                          </div>

                        </div>

                      </div>

                    ))
                  }

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </AuthGuard>
  );
}