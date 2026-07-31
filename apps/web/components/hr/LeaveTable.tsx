"use client";

import { motion } from "framer-motion";

import {
    ClipboardPenLine,
    Users,
    UserCircle2,
    CalendarDays,
    CheckCircle2,
    XCircle,
    Clock3,
    Check,
    Ban,
} from "lucide-react";
interface Props {
    loading: boolean;
    leaves: any[];
    role: string;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

export default function LeaveTable({
    loading,
    leaves,
    role,
    onApprove,
    onReject,
}: Props) {

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

            {/* TOP ACCENT */}

            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />

            {/* GLOW */}

            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-violet-400/15 blur-3xl" />

            <div className="relative z-10">

                <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex items-center gap-5">

                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 text-white shadow-xl">

                            <ClipboardPenLine size={30} />

                        </div>

                        <div>

                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-600">

                                Workforce Management

                            </p>

                            <h2 className="mt-2 text-3xl font-black text-slate-900">

                                Leave Requests

                            </h2>

                            <p className="mt-2 text-slate-500">

                                Review employee leave applications and manage approvals.

                            </p>

                        </div>

                    </div>

                    <div className="flex items-center gap-2 rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700">

                        <Users size={16} />

                        {leaves.length} Requests

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

                                                <div className="h-5 w-52 rounded bg-slate-200" />

                                                <div className="h-4 w-40 rounded bg-slate-100" />

                                                <div className="h-4 w-32 rounded bg-slate-100" />

                                            </div>

                                        </div>

                                        <div className="h-10 w-28 rounded-2xl bg-slate-200" />

                                    </div>

                                </div>

                            ))}

                        </div>

                    ) : leaves.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-slate-50 py-16 text-center">

                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100">

                                <ClipboardPenLine
                                    size={42}
                                    className="text-violet-600"
                                />

                            </div>

                            <h3 className="mt-6 text-2xl font-bold text-slate-800">

                                No Leave Requests

                            </h3>

                            <p className="mt-3 max-w-md text-slate-500">

                                Leave requests submitted by employees will appear here for review and approval.

                            </p>

                        </div>

                    ) : (

                        leaves.map((item: any) => (

                            <div
                                key={item.id}
                                className="border border-gray-100 bg-white/70 rounded-[28px] p-6 flex items-center justify-between hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
                            >
                                <div className="flex items-start gap-5">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 text-white">

                                        <UserCircle2 size={26} />

                                    </div>

                                    <div>

                                        <h3 className="text-lg font-bold text-slate-900">

                                            {item.employee?.name || "Unknown Employee"}

                                        </h3>

                                        <p className="mt-2 text-slate-600">

                                            {item.reason}

                                        </p>

                                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">

                                            <CalendarDays size={15} />

                                            {item.startDate?.slice(0, 10)}
                                            {" → "}
                                            {item.endDate?.slice(0, 10)}

                                        </div>

                                    </div>

                                </div>

                                <div className="text-right">

                                    <span
                                        className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2 text-sm font-semibold
                                                     ${item.status === "APPROVED"
                                                ? "bg-green-100 text-green-700"
                                                : item.status === "REJECTED"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >

                                        {item.status === "APPROVED" && <CheckCircle2 size={16} />}
                                        {item.status === "REJECTED" && <XCircle size={16} />}
                                        {item.status === "PENDING" && <Clock3 size={16} />}

                                        {item.status}

                                    </span>

                                    {(role === "ADMIN" || role === "HR") &&
                                        item.status === "PENDING" && (

                                            <div className="mt-5 flex gap-3">

                                                <button
                                                    onClick={() => onApprove(item.id)}
                                                    className="rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <Check size={16} />
                                                        Approve
                                                    </span>
                                                </button>

                                                <button
                                                    onClick={() => onReject(item.id)}
                                                    className="rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <Ban size={16} />
                                                        Reject
                                                    </span>
                                                </button>

                                            </div>

                                        )}

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </div>

        </motion.div>

    );

}