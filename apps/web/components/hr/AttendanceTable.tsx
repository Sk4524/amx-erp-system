"use client";

import { useState } from "react";

import { motion } from "framer-motion";

import {
    Download,
    Users,
    ClipboardList,
    CalendarDays,
    UserCircle2,
    CheckCircle2,
    XCircle,
    Clock3,
    Timer,
} from "lucide-react";

import api from "../../lib/api";
interface Props {
    loading: boolean;
    attendance: any[];

    employeeId: string;
    status: string;
    startDate: string;
    endDate: string;
}

export default function AttendanceTable({
    loading,
    attendance,
    employeeId,
    status,
    startDate,
    endDate,
}: Props) {
    const [exporting, setExporting] =
        useState(false);

    const exportAttendance = async () => {

        try {

            setExporting(true);

            const response =
                await api.get(
                    "/hr/attendance/export",
                    {
                        params: {
                            employeeId: employeeId || undefined,
                            status: status || undefined,
                            from: startDate || undefined,
                            to: endDate || undefined,
                        },

                        responseType: "blob",
                    }
                );

            const url =
                window.URL.createObjectURL(
                    new Blob([response.data])
                );

            const link =
                document.createElement("a");

            link.href = url;

            link.setAttribute(
                "download",
                "attendance.xlsx"
            );

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {

            console.error(err);

            alert(
                "Failed to export attendance."
            );

        } finally {

            setExporting(false);

        }

    };

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
            className="relative overflow-hidden rounded-[36px] border border-white/50 bg-white/80 p-7 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,.08)] mb-10"
        >

            {/* TOP ACCENT */}

            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500" />

            {/* GLOW */}

            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />

            <div className="relative z-10">

                <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex items-center gap-5">

                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-500 text-white shadow-xl">

                            <ClipboardList size={30} />

                        </div>

                        <div>

                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-600">

                                Workforce Records

                            </p>

                            <h2 className="mt-2 text-3xl font-black text-slate-900">

                                Attendance Records

                            </h2>

                            <p className="mt-2 text-slate-500">

                                View, filter and export employee attendance history.

                            </p>

                        </div>

                    </div>

                    <div className="flex flex-wrap items-center gap-3">

                        <button
                            onClick={exportAttendance}
                            disabled={exporting}
                            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >

                            <Download size={18} />

                            {exporting
                                ? "Exporting..."
                                : "Export Excel"}

                        </button>

                        <div className="flex items-center gap-2 rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-700">

                            <Users size={16} />

                            {attendance.length} Records

                        </div>

                    </div>

                </div>

                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">

                    {loading ? (
                        <div className="space-y-5 animate-pulse">

                            {[1, 2, 3].map((item) => (

                                <div
                                    key={item}
                                    className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm"
                                >

                                    <div className="flex items-center justify-between">

                                        <div className="flex items-center gap-5">

                                            <div className="h-14 w-14 rounded-2xl bg-slate-200" />

                                            <div className="space-y-3">

                                                <div className="h-5 w-48 rounded bg-slate-200" />

                                                <div className="h-4 w-32 rounded bg-slate-100" />

                                            </div>

                                        </div>

                                        <div className="h-10 w-28 rounded-2xl bg-slate-200" />

                                    </div>

                                </div>

                            ))}

                        </div>

                    ) : attendance.length === 0 ? (

                        <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-slate-50 py-16 text-center">

                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-100 to-blue-100">

                                <ClipboardList
                                    size={42}
                                    className="text-cyan-600"
                                />

                            </div>

                            <h3 className="mt-6 text-2xl font-bold text-slate-800">

                                No Attendance Records

                            </h3>

                            <p className="mt-3 max-w-md text-slate-500">

                                Attendance data will appear here once employees start marking attendance or records are imported.

                            </p>

                        </div>

                    ) : (

                        attendance.map((item: any) => (

                            <div
                                key={item.id}
                                className="flex items-center justify-between rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >

                                <div className="flex items-center gap-5">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white">

                                        <UserCircle2 size={26} />

                                    </div>

                                    <div>

                                        <h3 className="text-lg font-bold text-slate-900">

                                            {item.employee?.name || "Unknown Employee"}

                                        </h3>

                                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">

                                            <CalendarDays size={15} />

                                            {new Date(item.date).toLocaleDateString()}

                                        </div>

                                    </div>

                                </div>

                                <span
                                    className={`flex items-center gap-2 rounded-2xl px-5 py-2 text-sm font-semibold
        ${item.status === "PRESENT"
                                            ? "bg-green-100 text-green-700"
                                            : item.status === "ABSENT"
                                                ? "bg-red-100 text-red-700"
                                                : item.status === "LATE"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-blue-100 text-blue-700"
                                        }`}
                                >

                                    {item.status === "PRESENT" && <CheckCircle2 size={16} />}
                                    {item.status === "ABSENT" && <XCircle size={16} />}
                                    {item.status === "LATE" && <Clock3 size={16} />}
                                    {item.status === "HALF_DAY" && <Timer size={16} />}

                                    {item.status.replace("_", " ")}

                                </span>

                            </div>

                        ))

                    )}

                </div>

            </div>

        </motion.div>

    );

}