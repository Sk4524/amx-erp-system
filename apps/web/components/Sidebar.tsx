"use client";

import {
  LayoutDashboard,
  Users,
  User,
  Package,
  DollarSign,
  LogOut,
  ShieldCheck,
  ShoppingCart,
  Briefcase,
  BrainCircuit,
  Bell,
  BriefcaseBusiness,
  FolderKanban,
  FileSpreadsheet,
  Truck,
  ChevronRight,
  Sparkles,
  CircleDot,
  Trash2,
} from "lucide-react";
import socket
  from "../lib/socket";
import { ROLE_ACCESS }
  from "../lib/auth";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import clsx from "clsx";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../lib/api";

export default function Sidebar() {

  const router = useRouter();

  const pathname =
    usePathname();

  const [role, setRole] =
    useState("");

  const [userName,
    setUserName] =
    useState("");

  const [notifications,
    setNotifications] =
    useState<any[]>([]);

  const [showNotifications,
    setShowNotifications] =
    useState(false);

  // LOAD ROLE
  useEffect(() => {

    const savedRole =
      localStorage.getItem("role");

    if (savedRole) {

      setRole(savedRole);
    }

    const savedName =
      localStorage.getItem(
        "name"
      );

    if (savedName) {

      setUserName(
        savedName
      );
    }

  }, []);

  // FETCH NOTIFICATIONS
  const fetchNotifications =
    async () => {

      try {

        const res =
          await api.get(
            "/notifications"
          );

        setNotifications(
          res.data.data || res.data || []
        );

      } catch {

      }
    };

  useEffect(() => {

    fetchNotifications();

  }, []);

  useEffect(() => {

    const handleNotification =
      (data: any) => {

        setNotifications(
          (prev: any[]) => [

            {
              ...data,
              id: data.id,
              isRead: false,
              createdAt: new Date(),
            },

            ...prev,
          ]
        );
      };

    socket.on(
      "notification",
      handleNotification
    );

    return () => {

      socket.off(
        "notification",
        handleNotification
      );
    };

  }, []);

  const unreadCount =
    Array.isArray(notifications)
      ? notifications.filter(
        (n: any) => !n.isRead
      ).length
      : 0;

  const markAsRead =
    async (id: string) => {

      try {

        await api.put(
          `/notifications/${id}/read`
        );

        setNotifications(
          (prev: any) =>
            prev.map((n: any) =>
              n.id === id
                ? {
                  ...n,
                  isRead: true,
                }
                : n
            )
        );

      } catch {

      }
    };

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

      } catch {

      }
    };

  // MENU
  const menuItems = [

    {
      section: "MAIN",
    },

    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
    },


    {
      label: "Profile",
      icon: User,
      path: "/profile",
    },


    {
      section: "WORKSPACE",
    },
    {
      label: "User Management",
      icon: Users,
      path: "/users",
    },

    {
      label: "Employees",
      icon: Users,
      path: "/employees",
    },

    {
      label: "HR",
      icon: BriefcaseBusiness,
      path: "/hr",
    },

    {
      label: "Payroll",
      icon: Briefcase,
      path: "/payroll",
    },

    {
      label: "Projects",
      icon: FolderKanban,
      path: "/projects",
    },

    {
      section: "SUPPLY CHAIN",
    },

    {
      label: "Inventory",
      icon: Package,
      path: "/inventory",
    },

    {
      label: "Vendors",
      icon: Truck,
      path: "/vendors",
    },

    {
      section: "FINANCE",
    },

    {
      label: "Finance",
      icon: DollarSign,
      path: "/finance",
    },

    {
      label: "Invoices",
      icon: FileSpreadsheet,
      path: "/invoices",
    },


    {
      section: "CRM & ANALYTICS",
    },

    {
      label: "Sales",
      icon: ShoppingCart,
      path: "/sales",
    },

    {
      label: "Reports",
      icon: FileSpreadsheet,
      path: "/reports",
    },

    {
      label: "Audit Logs",
      icon: ShieldCheck,
      path: "/audit",
    },

    {
      label: "Notifications",
      icon: Bell,
      path: "/notifications",
    },

    {
      section: "AI SYSTEM",
    },

    {
      label: "Forecasting",
      icon: BrainCircuit,
      path: "/forecasting",
    },
  ];



  const allowedPaths =
    ROLE_ACCESS[
    role || "EMPLOYEE"
    ] || [];

  const filteredMenuItems =
    menuItems.filter((item: any) => {

      if (!item.section) {

        return allowedPaths.includes(
          item.path
        );
      }

      const nextSectionIndex =
        menuItems.findIndex(
          (m, i) =>

            i >
            menuItems.indexOf(item)

            &&

            m.section
        );

      const sectionItems =
        menuItems.slice(

          menuItems.indexOf(item) + 1,

          nextSectionIndex === -1

            ? undefined

            : nextSectionIndex
        );

      return sectionItems.some(
        (m: any) =>

          !m.section &&

          allowedPaths.includes(
            m.path
          )
      );
    });

  useEffect(() => {

    setShowNotifications(false);

  }, [pathname]);
  // ACTIVE PAGE
  const activePage =
    useMemo(() => {

      return filteredMenuItems.find(
        (item: any) =>
          item.path === pathname
      )?.label || "Unknown";

    }, [
      pathname,
      filteredMenuItems
    ]);


  return (

    <aside className="fixed left-0 top-0 z-50 h-screen w-[290px] bg-[#020617]/95 backdrop-blur-3xl border-r border-white/[0.04] text-white overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <div className="absolute top-[-120px] left-[-100px] w-[260px] h-[260px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute bottom-[-120px] right-[-80px] w-[220px] h-[220px] rounded-full bg-cyan-400/10 blur-3xl" />

      </div>

      {/* WRAPPER */}
      <div className="relative z-10 flex flex-col justify-between h-full overflow-y-auto custom-scrollbar">

        {/* TOP */}
        <div>

          {/* LOGO */}
          <div className="px-6 pt-7 pb-6 border-b border-white/[0.04]">

            <div className="flex items-center gap-4">

              {/* ICON */}
              <div className="relative">

                <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 rounded-3xl" />

                <div className="relative w-[58px] h-[58px] rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-xl">

                  <Briefcase
                    size={28}
                  />

                </div>

              </div>

              {/* TEXT */}
              <div>

                <h1 className="text-[25px] font-black tracking-tight leading-none bg-gradient-to-r from-blue-300 via-cyan-200 to-white bg-clip-text text-transparent">

                  AMX ERP

                </h1>

                <p className="text-[12px] text-slate-400 mt-2 leading-relaxed">

                  Enterprise Intelligence Platform

                </p>

              </div>

            </div>

          </div>

          {/* USER STRIP */}
          <div className="px-4 mt-5">

            <div className="relative overflow-hidden rounded-2xl bg-white/[0.04] border border-white/[0.05] backdrop-blur-xl p-4">

              {/* GLOW */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-cyan-400/10 blur-3xl" />

              <div className="relative flex items-center justify-between">

                {/* LEFT */}
                <div className="flex items-center gap-3">

                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 border border-white/[0.06] flex items-center justify-center">

                    <ShieldCheck
                      size={22}
                      className="text-cyan-300"
                    />

                  </div>

                  <div>

                    <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">

                      Logged In

                    </p>

                    <h3 className="font-semibold text-sm mt-1">

                      {
                        userName ||
                        role ||
                        "EMPLOYEE"
                      }

                    </h3>

                    <p className="text-[11px] text-slate-500">

                      {role}

                    </p>

                  </div>

                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/10">

                  <CircleDot
                    size={10}
                    className="text-emerald-400"
                    fill="currentColor"
                  />

                  <span className="text-[11px] font-medium text-emerald-300">

                    ACTIVE

                  </span>

                </div>

              </div>

              {/* ACTIVE PAGE */}
              <div className="mt-4 pt-4 border-t border-white/[0.04] flex items-center justify-between">

                <div>

                  <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">

                    Active Page

                  </p>

                  <h4 className="mt-1 text-sm font-medium text-slate-200">

                    {activePage}

                  </h4>

                </div>

                <Sparkles
                  size={18}
                  className="text-cyan-300"
                />

              </div>

            </div>

          </div>

          {/* NOTIFICATION PILL */}
          <div className="px-4 mt-4 relative">

            <button
              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }
              className="w-full group flex items-center justify-between rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.04] transition-all duration-300 px-4 py-3"
            >

              <div className="flex items-center gap-3">

                <div className="relative w-11 h-11 rounded-xl bg-yellow-500/10 border border-yellow-500/10 flex items-center justify-center">

                  <Bell
                    size={18}
                    className="text-yellow-300"
                  />

                  {unreadCount > 0 && (

                    <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg">

                      {
                        unreadCount > 99

                          ? "99+"

                          : unreadCount
                      }

                    </div>

                  )}

                </div>

                <div className="text-left">

                  <h4 className="text-sm font-medium">

                    Notifications

                  </h4>

                  <p className="text-[11px] text-slate-500 mt-0.5">

                    ERP activity feed

                  </p>

                </div>

              </div>

              <ChevronRight
                size={18}
                className={clsx(
                  "transition-all duration-300 text-slate-500",

                  showNotifications &&
                  "rotate-90 text-cyan-300"
                )}
              />

            </button>

            {/* PANEL */}
            {showNotifications && (

              <div className="mt-3 overflow-hidden rounded-2xl border border-white/[0.05] bg-[#0b1220]/95 backdrop-blur-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">

                <div className="px-4 py-3 border-b border-white/[0.04] flex items-center justify-between">

                  <div>

                    <h3 className="font-semibold text-sm">

                      Activity Feed

                    </h3>

                    <p className="text-[11px] text-slate-500 mt-1">

                      Live enterprise notifications

                    </p>

                  </div>

                  <div className="px-2.5 py-1 rounded-full bg-blue-500/10 text-[10px] font-semibold text-blue-300">

                    {notifications.length}

                  </div>

                </div>

                <div className="max-h-[280px] overflow-y-auto custom-scrollbar">

                  {notifications.length === 0 ? (

                    <div className="py-12 text-center text-slate-500 text-sm">

                      No notifications

                    </div>

                  ) : (

                    [...notifications]

                      .sort(

                        (a: any, b: any) =>

                          new Date(
                            b.createdAt
                          ).getTime()

                          -

                          new Date(
                            a.createdAt
                          ).getTime()
                      )

                      .map(
                        (item: any) => (

                          <div
                            key={item.id}
                            onClick={() => {

                              if (!item.isRead) {

                                markAsRead(item.id);
                              }
                            }}
                            className={clsx(
                              "group px-4 py-4 border-b border-white/[0.04] hover:bg-white/[0.03] transition-all duration-300",

                              !item.isRead &&
                              "bg-cyan-500/[0.03]"
                            )}
                          >

                            <div className="flex items-start justify-between gap-3">

                              {/* LEFT */}
                              <div className="flex items-start gap-3 flex-1">

                                <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2" />

                                <div className="flex-1">

                                  <h4 className="text-sm font-medium">

                                    {item.title}

                                  </h4>

                                  <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">

                                    {item.message}

                                  </p>

                                </div>

                              </div>

                              {/* DELETE */}
                              <button
                                onClick={(e) => {

                                  e.stopPropagation();

                                  const confirmed =
                                    window.confirm(
                                      "Delete this notification?"
                                    );

                                  if (!confirmed) {
                                    return;
                                  }

                                  deleteNotification(
                                    item.id
                                  );
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400"

                              >


                                <Trash2 size={15} />

                              </button>

                            </div>

                          </div>

                        ))
                  )}

                </div>

              </div>

            )}

          </div>

          {/* NAVIGATION */}
          <div className="px-4 py-5">

            {filteredMenuItems.map(
              (item: any, index) => {

                // SECTION
                if (item.section) {

                  return (

                    <div
                      key={index}
                      className="px-3 pt-5 pb-2"
                    >

                      <p className="text-[10px] uppercase tracking-[0.32em] text-slate-600 font-semibold">

                        {item.section}

                      </p>

                    </div>
                  );
                }

                const Icon =
                  item.icon;

                const active =

                  pathname === item.path ||

                  (
                    item.path !== "/" &&
                    pathname.startsWith(item.path)
                  );

                return (

                  <div
                    key={item.label}
                    onClick={() => {

                      if (pathname === item.path) {
                        return;
                      }

                      window.location.href = item.path;

                    }}
                    className={clsx(

                      "group relative flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 mb-1.5",

                      active
                        ? "bg-white/[0.06] border border-white/[0.05] shadow-[0_10px_30px_rgba(15,23,42,0.45)]"
                        : "hover:bg-white/[0.03]"
                    )}
                  >

                    {/* ACTIVE LINE */}
                    {active && (

                      <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-cyan-400" />

                    )}

                    {/* LEFT */}
                    <div className="flex items-center gap-3 relative">

                      <div
                        className={clsx(

                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",

                          active
                            ? "bg-cyan-400/10 text-cyan-300"
                            : "bg-white/[0.03] text-slate-400 group-hover:text-white group-hover:bg-white/[0.05]"
                        )}
                      >

                        <Icon size={18} />

                      </div>

                      <span
                        className={clsx(

                          "text-[14px] transition-all duration-300",

                          active
                            ? "text-white font-semibold"
                            : "text-slate-400 font-medium group-hover:text-white"
                        )}
                      >

                        {item.label}

                      </span>

                    </div>

                    {/* RIGHT */}
                    <ChevronRight
                      size={15}
                      className={clsx(

                        "transition-all duration-300",

                        active
                          ? "opacity-100 text-cyan-300"
                          : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-slate-600"
                      )}
                    />

                  </div>

                );
              })}

          </div>

        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-white/[0.04] bg-black/10 backdrop-blur-xl">

          <div
            className="group flex items-center gap-3 rounded-2xl px-4 py-3 cursor-pointer border border-red-500/[0.08] bg-red-500/[0.03] hover:bg-red-500/[0.08] transition-all duration-300"
            onClick={() => {

              const confirmed =
                window.confirm(
                  "Are you sure you want to logout?"
                );

              if (!confirmed) {
                return;
              }

              socket.disconnect();

              localStorage.clear();

              router.push("/login");
            }}
          >

            <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center">

              <LogOut
                size={18}
                className="text-red-400"
              />

            </div>

            <div>

              <h4 className="font-medium text-red-300 text-sm">

                Logout

              </h4>

              <p className="text-[11px] text-red-400/60 mt-0.5">

                Securely end session

              </p>

            </div>

          </div>

        </div>

      </div>

      {/* SCROLLBAR */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.18);
          border-radius: 999px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.35);
        }
      `}</style>

    </aside>
  );
}