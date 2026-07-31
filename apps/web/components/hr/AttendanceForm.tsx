"use client";

import { motion } from "framer-motion";

import {
    ClipboardCheck,
    UserPlus,
    Save,
} from "lucide-react";

interface Props {
    employees: any[];
    employeeId: string;
    status: string;
    saving: boolean;
    onEmployeeChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onSave: () => void;
}

export default function AttendanceForm({
    employees,
    employeeId,
    status,
    saving,
    onEmployeeChange,
    onStatusChange,
    onSave,
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

            {/* Top Accent */}

            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500" />

            {/* Glow */}

            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />

            <div className="relative z-10">

                <div className="mb-8 flex items-center justify-between">

                    <div>

                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-600">

                            Quick Action

                        </p>

                        <h2 className="mt-2 text-3xl font-black text-slate-900">

                            Attendance Management

                        </h2>

                        <p className="mt-2 text-slate-500">

                            Record employee attendance quickly and accurately.

                        </p>

                    </div>

                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-500 text-white shadow-xl">

                        <ClipboardCheck size={30} />

                    </div>

                </div>

                <div className="mb-5">

                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">

                        <UserPlus
                            size={16}
                            className="text-cyan-600"
                        />

                        Employee

                    </label>

                    <select
                        className="w-full rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition-all duration-300 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                        value={employeeId}
                        onChange={(e) => onEmployeeChange(e.target.value)}
                    >

                        <option value="">

                            Select Employee

                        </option>

                        {employees.map((emp: any) => (

                            <option
                                key={emp.id}
                                value={emp.id}
                            >

                                {emp.name}

                            </option>

                        ))}

                    </select>

                </div>

                <div className="mb-6">

                    <label className="mb-2 block text-sm font-semibold text-slate-700">

                        Attendance Status

                    </label>

                    <select
                        className="w-full rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition-all duration-300 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                        value={status}
                        onChange={(e) => onStatusChange(e.target.value)}
                    >

                        <option>PRESENT</option>
                        <option>ABSENT</option>

                    </select>

                </div>

                <button
                    disabled={saving}
                    onClick={onSave}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 py-4 font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
                >

                    <Save size={18} />

                    {saving ? "Saving Attendance..." : "Save Attendance"}

                </button>

                <div className="mt-6 grid grid-cols-2 gap-4">

                    <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4">

                        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-600">

                            Employees

                        </p>

                        <h3 className="mt-2 text-2xl font-black text-cyan-700">

                            {employees.length}

                        </h3>

                    </div>

                    <div className="rounded-2xl border border-violet-100 bg-violet-50/70 p-4">

                        <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">

                            Status

                        </p>

                        <h3 className="mt-2 text-lg font-black text-violet-700">

                            {status.replace("_", " ")}

                        </h3>

                    </div>

                </div>

            </div>

        </motion.div>

    );

}