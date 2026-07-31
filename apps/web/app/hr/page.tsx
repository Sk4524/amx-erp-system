"use client";
import QuickActions from "../../components/hr/QuickActions";
import SectionHeader from "../../components/hr/SectionHeader";
import AttendanceStatusChart from "../../components/hr/AttendanceStatusChart";
import LeaveStatusChart from "../../components/hr/LeaveStatusChart";
import AttendanceTrendChart from "../../components/hr/AttendanceTrendChart";
import Sidebar from "../../components/Sidebar";
import AuthGuard from "../../components/AuthGuard";
import ExecutiveHRInsights from "../../components/hr/ExecutiveHRInsights";
import toast from "react-hot-toast";
import HRSkeleton from "../../components/hr/HRSkeleton";
import DashboardCards from "../../components/hr/DashboardCards";
import AttendanceTable from "../../components/hr/AttendanceTable";
import LeaveTable from "../../components/hr/LeaveTable";
import AttendanceForm from "../../components/hr/AttendanceForm";
import { useEffect, useState }
    from "react";

import api from "../../lib/api";
import HRFilterToolbar from "../../components/hr/HRFilterToolbar";
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

    const [dashboard, setDashboard] =
        useState<any>({
            totalEmployees: 0,
            present: 0,
            absent: 0,
            late: 0,
            halfDay: 0,
            pendingLeaves: 0,
            approvedLeaves: 0,
            rejectedLeaves: 0,
        });

    const [trendData, setTrendData] =
        useState<any[]>([]);

    const [employeeId,
        setEmployeeId] =
        useState("");


    const [status,
        setStatus] =
        useState("PRESENT");

    const [role,
        setRole] =
        useState("");

    const [loading,
        setLoading] =
        useState(true);

    const [saving,
        setSaving] =
        useState(false);

    const [search, setSearch] =
        useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const filteredAttendance = attendance.filter((item) => {
        const employeeName = item.employee?.name?.toLowerCase() || "";
        const department = item.employee?.department?.toLowerCase() || "";
        const statusText = item.status?.toLowerCase() || "";

        const searchText = search.toLowerCase();

        const matchesSearch =
            employeeName.includes(searchText) ||
            department.includes(searchText) ||
            statusText.includes(searchText);

        const attendanceDate = new Date(item.date);

        const matchesStart =
            !startDate || attendanceDate >= new Date(startDate);

        const matchesEnd =
            !endDate || attendanceDate <= new Date(endDate);

        return matchesSearch && matchesStart && matchesEnd;
    });
    const filteredLeaves = leaves.filter((item) => {
        const employeeName = item.employee?.name?.toLowerCase() || "";
        const reason = item.reason?.toLowerCase() || "";
        const statusText = item.status?.toLowerCase() || "";

        const searchText = search.toLowerCase();

        const matchesSearch =
            employeeName.includes(searchText) ||
            reason.includes(searchText) ||
            statusText.includes(searchText);

        const leaveStartDate = new Date(item.startDate);

        const matchesStart =
            !startDate || leaveStartDate >= new Date(startDate);

        const matchesEnd =
            !endDate || leaveStartDate <= new Date(endDate);

        return matchesSearch && matchesStart && matchesEnd;
    });
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
                    empRes,
                    dashboardRes,
                    trendRes,
                ] = await Promise.all([
                    api.get("/hr/attendance"),
                    api.get("/hr/leave"),
                    api.get("/employee"),
                    api.get("/hr/dashboard"),
                    api.get("/hr/dashboard/trend"),
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

                setDashboard(
                    dashboardRes.data.data
                );

                setTrendData(
                    trendRes.data.data || []
                );
            } catch (err) {

                console.log(err);

            } finally {

                setLoading(false);
            }
        };


    useEffect(() => {

        if (
            role === "ADMIN" ||
            role === "HR" ||
            role === "MANAGER"
        ) {

            fetchData();

        }

    }, [role]);


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
                    role === "HR" ||
                    role === "MANAGER"
                )
                    ?
                    (

                        <div className="flex">

                            <Sidebar />

                            <div className="ml-72 w-full px-6 xl:px-8 py-7 bg-gradient-to-br from-[#eef2f7] via-[#edf3ff] to-[#e5ebf3] min-h-screen text-black overflow-x-hidden backdrop-blur-sm">
                                {loading ? (

                                    <HRSkeleton />

                                ) : (

                                    <>

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
                                        <DashboardCards
                                            attendanceRecords={attendance.length}
                                            leaveRequests={leaves.length}
                                            pendingLeaves={dashboard.pendingLeaves}
                                            totalEmployees={dashboard.totalEmployees}
                                            present={dashboard.present}
                                        />
                                        <SectionHeader
                                            title="Workforce Analytics"
                                            subtitle="Attendance, leave trends and workforce performance overview."
                                        />
                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">

                                            <AttendanceStatusChart
                                                present={dashboard.present}
                                                absent={dashboard.absent}
                                                late={dashboard.late}
                                                halfDay={dashboard.halfDay}
                                            />

                                            <LeaveStatusChart
                                                pending={dashboard.pendingLeaves}
                                                approved={dashboard.approvedLeaves}
                                                rejected={dashboard.rejectedLeaves}
                                            />

                                        </div>

                                        <div className="mb-10">

                                            <AttendanceTrendChart
                                                data={trendData}
                                            />
                                        </div>

                                        <SectionHeader
                                            title="Executive Insights"
                                            subtitle="AI-powered workforce insights and operational recommendations."
                                        />
                                        <ExecutiveHRInsights
                                            attendance={attendance}
                                            leaves={leaves}
                                        />

                                        <div className="mt-10 mb-10">
                                            <QuickActions />
                                        </div>
                                        <HRFilterToolbar
                                            search={search}
                                            onSearchChange={setSearch}
                                            startDate={startDate}
                                            endDate={endDate}
                                            onStartDateChange={setStartDate}
                                            onEndDateChange={setEndDate}
                                        />
                                        <div className="mt-10 mb-10">
                                            <SectionHeader
                                                title="HR Operations"
                                                subtitle="Manage attendance, leave requests and workforce activities."
                                            />
                                        </div>
                                        {/* FORMS */}
                                        {
                                            (role === "ADMIN" || role === "HR") && (
                                                <div className="mb-10">

                                                    <AttendanceForm
                                                        employees={employees}
                                                        employeeId={employeeId}
                                                        status={status}
                                                        saving={saving}
                                                        onEmployeeChange={setEmployeeId}
                                                        onStatusChange={setStatus}
                                                        onSave={() => {

                                                            const confirmed =
                                                                window.confirm("Save attendance?");

                                                            if (!confirmed) return;

                                                            createAttendance();

                                                        }}
                                                    />

                                                </div>
                                            )
                                        }

                                        {/* ATTENDANCE TABLE */}
                                        <AttendanceTable
                                            loading={loading}
                                            attendance={filteredAttendance}
                                            employeeId={employeeId}
                                            status={status}
                                            startDate={startDate}
                                            endDate={endDate}
                                        />

                                        {/* LEAVE TABLE */}
                                        <LeaveTable
                                            loading={loading}
                                            leaves={filteredLeaves}
                                            role={role}
                                            onApprove={approveLeave}
                                            onReject={rejectLeave}
                                        />
                                    </>

                                )}
                            </div>

                        </div>
                    )
                    :
                    null
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