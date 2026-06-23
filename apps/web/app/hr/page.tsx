"use client";

import Sidebar from "../../components/Sidebar";
import AuthGuard from "../../components/AuthGuard";
import toast from "react-hot-toast";

import { useEffect, useState }
    from "react";

import api from "../../lib/api";

export default function HrPage() {

    const [attendance,
        setAttendance] =
        useState<any[]>([]);

    const [leaves,
        setLeaves] =
        useState<any[]>([]);

    const [employees,
        setEmployees] =
        useState<any[]>([]);

    const [employeeId,
        setEmployeeId] =
        useState("");


    const [status,
        setStatus] =
        useState("PRESENT");

    const [reason,
        setReason] =
        useState("");

    const [startDate,
        setStartDate] =
        useState("");

    const [endDate,
        setEndDate] =
        useState("");

    const [role,
        setRole] =
        useState("");

    const [loading,
        setLoading] =
        useState(true);


    const [saving,
        setSaving] =
        useState(false);

    // LOAD ROLE
    useEffect(() => {

        const savedRole =
            localStorage.getItem("role");

        if (savedRole) {

            setRole(savedRole);
        }

    }, []);

    // FETCH DATA
    const fetchData =
        async () => {

            try {

                setLoading(true);

                const [
                    attendanceRes,
                    leaveRes,
                    empRes
                ] = await Promise.all([
                    api.get("/hr/attendance"),
                    api.get("/hr/leave"),
                    api.get("/employee")
                ]);

                setAttendance(
                    attendanceRes.data.data || []
                );

                setLeaves(
                    leaveRes.data.data || []
                );

                setEmployees(
                    empRes.data?.data?.data ||
                    empRes.data?.data ||
                    []
                );
            } catch (err) {

                console.log(err);

            } finally {

                setLoading(false);
            }
        };

    useEffect(() => {

        fetchData();

    }, []);

    // CREATE ATTENDANCE
    const createAttendance =
        async () => {

            if (!employeeId) {

                toast.error(
                    "Select employee"
                );

                return;
            }

            try {

                setSaving(true);

                await api.post(
                    "/hr/attendance",
                    {
                        employeeId,
                        date: new Date(),
                        status,
                    }
                );

                setEmployeeId("");
                setStatus("PRESENT");

                await fetchData();

                toast.success(
                    "Attendance Added ✅"
                );

            } catch (err) {

                console.log(err);

                toast.error(
                    "Failed to add attendance"
                );

            } finally {

                setSaving(false);

            }
        };

    // CREATE LEAVE
    const createLeave =
        async () => {

            console.log({
                employeeId,
                reason,
                startDate,
                endDate
            });

            if (
                !employeeId ||
                !reason.trim() ||
                !startDate ||
                !endDate
            ) {

                toast.error(
                    "All fields are required"
                );

                return;
            }

            try {

                setSaving(true);

                await api.post(
                    "/hr/leave",
                    {
                        employeeId,
                        reason,
                        startDate,
                        endDate,
                    }
                );

                setEmployeeId("");
                setReason("");
                setStartDate("");
                setEndDate("");

                await fetchData();

                toast.success(
                    "Leave Requested ✅"
                );

            } catch (err) {

                console.log(err);

                toast.error(
                    "Failed to request leave"
                );

            } finally {

                setSaving(false);

            }
        };
    // APPROVE LEAVE
    const approveLeave =
        async (id: string) => {

            try {

                await api.put(
                    `/hr/leave/${id}/approve`
                );

                await fetchData();

            } catch (err) {

                console.log(err);
                toast.error("Failed to approve leave");
            }
        };

    // REJECT LEAVE
    const rejectLeave =
        async (id: string) => {

            try {

                await api.put(
                    `/hr/leave/${id}/reject`
                );

                await fetchData();

            } catch (err) {

                console.log(err);
                toast.error("Failed to reject leave");
            }
        };

    return (

        <AuthGuard>

            {
                (
                    role === "ADMIN" ||
                    role === "HR"
                )
                    ?
                    (

                        <div className="flex">

                            <Sidebar />

                            <div className="ml-72 w-full px-6 xl:px-8 py-7 bg-gradient-to-br from-[#eef2f7] via-[#edf3ff] to-[#e5ebf3] min-h-screen text-black overflow-x-hidden backdrop-blur-sm">
                                {/* HEADER */}
                                <div className="relative overflow-hidden bg-white/75 backdrop-blur-2xl border border-white/50 shadow-[0_20px_70px_rgba(0,0,0,0.08)] rounded-[36px] p-6 xl:p-7 mb-10">

                                    {/* PREMIUM OVERLAY */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-fuchsia-50/30 pointer-events-none"></div>

                                    {/* GLOW EFFECTS */}
                                    <div className="absolute -top-24 -right-24 w-80 h-80 bg-fuchsia-400/20 rounded-full blur-3xl"></div>

                                    <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl"></div>

                                    {/* TOP BORDER */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-500 via-violet-500 to-purple-500"></div>

                                    {/* CONTENT */}
                                    <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                                        {/* LEFT */}
                                        <div className="flex-1 max-w-3xl">

                                            {/* TITLE */}
                                            <div className="flex items-start gap-4">

                                                {/* ICON */}
                                                <div className="relative">

                                                    <div className="absolute inset-0 bg-fuchsia-500/30 blur-2xl rounded-full"></div>

                                                    <div className="relative bg-gradient-to-br from-fuchsia-600 via-violet-500 to-purple-500 text-white p-4 rounded-[28px] shadow-[0_15px_35px_rgba(168,85,247,0.35)] border border-white/20">

                                                        🏢

                                                    </div>

                                                </div>

                                                {/* TEXT */}
                                                <div>

                                                    <p className="text-sm uppercase tracking-[0.30em] text-fuchsia-600 font-bold">

                                                        Enterprise ERP

                                                    </p>

                                                    <h1 className="text-4xl sm:text-5xl xl:text-[56px] font-black text-[#0f172a] tracking-tight leading-[0.95] mt-2">

                                                        HR
                                                        <br />
                                                        Dashboard

                                                    </h1>

                                                    {/* TAGS */}
                                                    <div className="flex flex-wrap items-center gap-3 mt-4">

                                                        <div className="bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">

                                                            HR MANAGEMENT

                                                        </div>

                                                        <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">

                                                            ATTENDANCE TRACKING

                                                        </div>

                                                        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide hidden sm:flex">

                                                            LEAVE WORKFLOW

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                            {/* DESCRIPTION */}
                                            <p className="text-gray-600 text-[17px] leading-relaxed max-w-2xl mt-6">

                                                Manage employee attendance, leave approvals,
                                                workforce productivity and HR operational workflows
                                                through a centralized enterprise HR management system.

                                            </p>

                                            {/* STATUS */}
                                            <div className="flex flex-wrap items-center gap-3 mt-6">

                                                {/* ACTIVE */}
                                                <div className="flex items-center gap-2 bg-emerald-100/80 backdrop-blur-xl text-emerald-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-emerald-200 shadow-sm">

                                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>

                                                    HR Operations Active

                                                </div>

                                                {/* ATTENDANCE */}
                                                <div className="bg-fuchsia-100/80 backdrop-blur-xl text-fuchsia-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-fuchsia-200 shadow-sm">

                                                    Attendance Monitoring Enabled

                                                </div>

                                                {/* WORKFLOW */}
                                                <div className="bg-violet-100/80 backdrop-blur-xl text-violet-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-violet-200 shadow-sm">

                                                    Smart Leave Workflow

                                                </div>

                                            </div>

                                        </div>

                                        {/* RIGHT */}
                                        <div className="hidden xl:flex items-center justify-center">

                                            <div className="relative">

                                                <div className="absolute inset-0 bg-fuchsia-400/20 blur-3xl rounded-full"></div>

                                                <div className="relative w-52 h-52 rounded-full bg-gradient-to-br from-fuchsia-500/10 via-violet-500/10 to-purple-500/10 border border-white/30 backdrop-blur-2xl flex items-center justify-center">

                                                    <div className="text-[80px]">

                                                        🏢

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                {/* ANALYTICS */}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">

                                    <div className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-[32px] p-7 shadow-xl min-h-[190px] hover:-translate-y-1 transition-all duration-300">

                                        <p className="text-white/80">
                                            Attendance Records
                                        </p>

                                        <h2 className="text-5xl font-black mt-5">
                                            {attendance.length}
                                        </h2>

                                    </div>

                                    <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-[32px] p-7 shadow-xl min-h-[190px] hover:-translate-y-1 transition-all duration-300">

                                        <p className="text-white/80">
                                            Leave Requests
                                        </p>

                                        <h2 className="text-5xl font-black mt-5">
                                            {leaves.length}
                                        </h2>

                                    </div>

                                    <div className="bg-gradient-to-r from-red-500 to-orange-400 text-white rounded-[32px] p-7 shadow-xl min-h-[190px] hover:-translate-y-1 transition-all duration-300">

                                        <p className="text-white/80">
                                            Pending Leaves
                                        </p>

                                        <h2 className="text-5xl font-black mt-5">

                                            {
                                                leaves.filter(
                                                    (l: any) =>
                                                        l.status ===
                                                        "PENDING"
                                                ).length
                                            }

                                        </h2>

                                    </div>

                                    <div className="bg-gradient-to-r from-emerald-500 to-green-400 text-white rounded-[32px] p-7 shadow-xl min-h-[190px] hover:-translate-y-1 transition-all duration-300">

                                        <p className="text-white/80">
                                            Total Employees
                                        </p>

                                        <h2 className="text-5xl font-black mt-5">
                                            {employees.length}
                                        </h2>

                                    </div>
                                    <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-[32px] p-7 shadow-xl min-h-[190px]">

                                        <p className="text-white/80">
                                            Present Today
                                        </p>

                                        <h2 className="text-5xl font-black mt-5">

                                            {
                                                attendance.filter(
                                                    (a: any) =>
                                                        a.status === "PRESENT"
                                                ).length
                                            }

                                        </h2>

                                    </div>

                                </div>

                                {/* FORMS */}
                                <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8 mb-10 items-start">

                                    {/* ATTENDANCE */}
                                    <div className="bg-white/80 backdrop-blur-md rounded-[32px] shadow-xl border border-white/40 p-7 hover:shadow-2xl transition-all duration-300">

                                        <h2 className="text-3xl font-black mb-6 text-gray-800">
                                            Mark Attendance
                                        </h2>

                                        <select
                                            className="w-full border border-gray-200 bg-white/90 shadow-sm p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                                            value={employeeId}
                                            onChange={(e) =>
                                                setEmployeeId(
                                                    e.target.value
                                                )
                                            }
                                        >

                                            <option value="">
                                                Select Employee
                                            </option>

                                            {employees.map(
                                                (emp: any) => (

                                                    <option
                                                        key={emp.id}
                                                        value={emp.id}
                                                    >
                                                        {emp.name}
                                                    </option>

                                                ))}

                                        </select>

                                        <select
                                            className="w-full border border-gray-200 bg-white/90 shadow-sm p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                                            value={status}
                                            onChange={(e) =>
                                                setStatus(
                                                    e.target.value
                                                )
                                            }
                                        >

                                            <option>
                                                PRESENT
                                            </option>

                                            <option>
                                                ABSENT
                                            </option>

                                        </select>

                                        <button
                                            disabled={saving}
                                            onClick={() => {

                                                const confirmed =
                                                    window.confirm(
                                                        "Save attendance?"
                                                    );

                                                if (!confirmed) {
                                                    return;
                                                }

                                                createAttendance();

                                            }}
                                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg font-semibold"
                                        >
                                            {
                                                saving
                                                    ? "Saving..."
                                                    : "Save Attendance"
                                            }

                                        </button>

                                    </div>

                                    {/* LEAVE */}
                                    <div className="bg-white/80 backdrop-blur-md rounded-[32px] shadow-xl border border-white/40 p-7 hover:shadow-2xl transition-all duration-300">

                                        <h2 className="text-3xl font-black mb-6 text-gray-800">
                                            Leave Request
                                        </h2>

                                        <select
                                            className="w-full border border-gray-200 bg-white/90 shadow-sm p-4 rounded-2xl mb-4 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                                            value={employeeId}
                                            onChange={(e) =>
                                                setEmployeeId(e.target.value)
                                            }
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

                                        <textarea
                                            placeholder="Reason"
                                            className="w-full border border-gray-200 bg-white/90 shadow-sm p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                                            value={reason}
                                            onChange={(e) =>
                                                setReason(
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <input
                                            type="date"
                                            className="w-full border border-gray-200 bg-white/90 shadow-sm p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                                            value={startDate}
                                            onChange={(e) =>
                                                setStartDate(
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <input
                                            type="date"
                                            className="w-full border border-gray-200 bg-white/90 shadow-sm p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                                            value={endDate}
                                            onChange={(e) =>
                                                setEndDate(
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <button
                                            disabled={saving}
                                            onClick={() => {

                                                const confirmed =
                                                    window.confirm(
                                                        "Submit leave request?"
                                                    );

                                                if (!confirmed) {
                                                    return;
                                                }

                                                createLeave();

                                            }}
                                            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg font-semibold"
                                        >

                                            {
                                                saving
                                                    ? "Submitting..."
                                                    : "Submit Leave"
                                            }

                                        </button>

                                    </div>

                                </div>

                                {/* ATTENDANCE TABLE */}
                                <div className="bg-white/80 backdrop-blur-md rounded-[32px] shadow-xl border border-white/40 p-7 mb-10">

                                    <div className="flex items-center justify-between mb-7">

                                        <div>

                                            <h2 className="text-3xl font-black text-gray-800">
                                                Attendance Records
                                            </h2>

                                            <p className="text-gray-500 mt-2">
                                                Workforce attendance monitoring
                                            </p>

                                        </div>

                                        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-2xl text-sm font-semibold">
                                            {attendance.length} Records
                                        </div>

                                    </div>

                                    {/* LIST */}
                                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">

                                        {loading ? (
                                            <div className="animate-pulse space-y-4">

                                                <div className="h-24 bg-gray-200 rounded-3xl"></div>

                                                <div className="h-24 bg-gray-200 rounded-3xl"></div>

                                                <div className="h-24 bg-gray-200 rounded-3xl"></div>

                                            </div>

                                        ) : attendance.length === 0 ? (

                                            <div className="py-14 flex flex-col items-center justify-center text-center">

                                                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4 text-4xl">
                                                    📅
                                                </div>

                                                <h3 className="text-xl font-semibold text-gray-700">
                                                    No Attendance Records
                                                </h3>

                                                <p className="text-gray-500 mt-2">
                                                    Attendance records will appear here.
                                                </p>

                                            </div>

                                        ) : (

                                            attendance.map((item: any) => (

                                                <div
                                                    key={item.id}
                                                    className="border border-gray-100 bg-white/70 rounded-[28px] p-6 flex items-center justify-between hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
                                                >

                                                    <div>

                                                        <h3 className="font-bold text-xl text-gray-800">
                                                            {item.employee?.name || "Unknown Employee"}
                                                        </h3>

                                                        <p className="text-gray-500 mt-2">

                                                            {
                                                                new Date(
                                                                    item.date
                                                                ).toLocaleDateString()
                                                            }

                                                        </p>

                                                    </div>

                                                    <div>

                                                        <span className={`px-5 py-2 rounded-2xl text-sm font-semibold

              ${item.status === "PRESENT"
                                                                ? "bg-green-100 text-green-700"

                                                                : item.status === "ABSENT"
                                                                    ? "bg-red-100 text-red-700"

                                                                    : "bg-yellow-100 text-yellow-700"
                                                            }

            `}>

                                                            {item.status}

                                                        </span>

                                                    </div>

                                                </div>

                                            ))
                                        )}

                                    </div>

                                </div>

                                {/* LEAVE TABLE */}
                                <div className="bg-white/80 backdrop-blur-md rounded-[32px] shadow-xl border border-white/40 p-7 hover:shadow-2xl transition-all duration-300">

                                    <h2 className="text-2xl font-bold mb-6">
                                        Leave Requests
                                    </h2>


                                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">

                                        {loading ? (

                                            <div className="animate-pulse space-y-4">

                                                <div className="h-24 bg-gray-200 rounded-3xl"></div>

                                                <div className="h-24 bg-gray-200 rounded-3xl"></div>

                                                <div className="h-24 bg-gray-200 rounded-3xl"></div>

                                            </div>

                                        ) : leaves.length === 0 ? (

                                            <div className="py-14 flex flex-col items-center justify-center text-center">

                                                <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-4 text-4xl">
                                                    📝
                                                </div>

                                                <h3 className="text-xl font-semibold text-gray-700">
                                                    No Leave Requests
                                                </h3>

                                                <p className="text-gray-500 mt-2">
                                                    Leave requests will appear here.
                                                </p>

                                            </div>

                                        ) : (

                                            leaves.map(
                                                (item: any) => (

                                                    <div
                                                        key={item.id}
                                                        className="border border-gray-100 bg-white/70 rounded-[28px] p-6 flex items-center justify-between hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
                                                    >

                                                        <div>

                                                            <h3 className="font-bold text-lg">
                                                                {
                                                                    item.employee?.name
                                                                }
                                                            </h3>

                                                            <p className="text-gray-500 mt-1">
                                                                {item.reason}
                                                            </p>

                                                            <p className="text-sm text-gray-400 mt-2">

                                                                {item.startDate?.slice(0, 10)}
                                                                {" "}→{" "}
                                                                {item.endDate?.slice(0, 10)}

                                                            </p>

                                                        </div>

                                                        <div className="text-right">

                                                            <span
                                                                className={` px-5 py-2 rounded-2xl text-sm font-bold
                                                            ${item.status === "APPROVED"
                                                                        ? "bg-green-100 text-green-700"
                                                                        : item.status === "REJECTED"
                                                                            ? "bg-red-100 text-red-700"
                                                                            : "bg-yellow-100 text-yellow-700"
                                                                    }

                                                                `}
                                                            >

                                                                {item.status}

                                                            </span>

                                                            {role === "ADMIN" &&
                                                                item.status === "PENDING" && (

                                                                    <div className="flex gap-3 mt-4">

                                                                        <button
                                                                            onClick={() => {

                                                                                const confirmed =
                                                                                    window.confirm(
                                                                                        "Approve leave request?"
                                                                                    );

                                                                                if (!confirmed) {
                                                                                    return;
                                                                                }

                                                                                approveLeave(item.id);
                                                                            }}
                                                                            className="bg-green-100 text-green-700 px-5 py-2 rounded-2xl text-sm font-semibold hover:bg-green-200 transition-all duration-300"
                                                                        >
                                                                            Approve
                                                                        </button>

                                                                        <button
                                                                            onClick={() => {

                                                                                const confirmed =
                                                                                    window.confirm(
                                                                                        "Reject leave request?"
                                                                                    );

                                                                                if (!confirmed) {
                                                                                    return;
                                                                                }

                                                                                rejectLeave(item.id);
                                                                            }}
                                                                            className="bg-red-100 text-red-700 px-5 py-2 rounded-2xl text-sm font-semibold hover:bg-red-200 transition-all duration-300"
                                                                        >
                                                                            Reject
                                                                        </button>

                                                                    </div>

                                                                )}

                                                        </div>

                                                    </div>

                                                ))
                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>
                    )
                    :
                    (
                        <div className="p-10">
                            Access Denied
                        </div>
                    )
            }
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