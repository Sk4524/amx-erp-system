"use client";

import toast from "react-hot-toast";
import {
  FiUsers,

} from "react-icons/fi";

import useRole from "../../lib/useRole";
import { motion } from "framer-motion";
import Sidebar from "../../components/Sidebar";
import AuthGuard from "../../components/AuthGuard";

import { useEffect, useState } from "react";

import api from "../../lib/api";

export default function EmployeesPage() {

  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");

  const [editingId, setEditingId] = useState("");
  const [debouncedSearch,
    setDebouncedSearch] =
    useState("");


  const [search, setSearch] = useState("");

  const {
    role,
    loading: roleLoading
  } = useRole();

  // FETCH EMPLOYEES
  const fetchEmployees = async () => {

    try {

      setLoading(true);

      const res = await api.get(
        `/employee?search=${encodeURIComponent(
          debouncedSearch
        )}`
      );

      setEmployees(
        Array.isArray(
          res.data?.data?.data
        )
          ? res.data.data.data
          : Array.isArray(
            res.data?.data
          )
            ? res.data.data
            : []
      );

    } catch (err) {
      toast.error("Failed to fetch employees");

      setEmployees([]);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    const timer =
      setTimeout(() => {

        setDebouncedSearch(
          search
        );

      }, 500);

    return () =>
      clearTimeout(timer);

  }, [search]);


  // INITIAL LOAD
  useEffect(() => {

    if (
      roleLoading
    ) {
      return;
    }

    if (
      role === "ADMIN" ||
      role === "HR"
    ) {

      fetchEmployees();

    } else {

      setLoading(false);

    }

  }, [
    debouncedSearch,
    role,
    roleLoading
  ]);

  // ADD EMPLOYEE
  const addEmployee = async () => {

    if (
      !name.trim() ||
      !position.trim() ||
      !salary
    ) {

      toast.error(
        "All fields are required"
      );

      return;
    }
    if (

      Number.isNaN(
        Number(salary)
      ) ||

      Number(salary) <= 0

    ) {

      toast.error(
        "Salary must be greater than 0"
      );

      return;
    }
    setSaving(true);
    try {

      await api.post(
        "/employee",
        {
          name,
          position,
          salary: Number(salary),
        }
      );

      setName("");
      setPosition("");
      setSalary("");

      fetchEmployees();

      toast.success("Employee Added ✅");

    } catch (err: any) {

      toast.error("Add Employee Failed");
    }
    finally {

      setSaving(false);

    }
  };

  // DELETE EMPLOYEE
  const deleteEmployee = async (id: string) => {

    try {

      await api.delete(
        `/employee/${id}`
      );

      fetchEmployees();

      toast.success("Employee Deleted ✅");
    } catch (err: any) {

      toast.error("Delete Failed");
    }
  };

  // UPDATE EMPLOYEE
  const updateEmployee = async () => {
    if (
      !name.trim() ||
      !position.trim() ||
      !salary
    ) {

      toast.error(
        "All fields are required"
      );

      return;
    }
    if (

      Number.isNaN(
        Number(salary)
      ) ||

      Number(salary) <= 0

    ) {

      toast.error(
        "Salary must be greater than 0"
      );

      return;
    }


    setSaving(true);
    try {

      await api.put(
        `/employee/${editingId}`,
        {
          name,
          position,
          salary: Number(salary),
        }
      );

      setEditingId("");

      setName("");
      setPosition("");
      setSalary("");

      fetchEmployees();

      toast.success("Employee Updated ✅");

    } catch (err: any) {

      toast.error("Update Failed");
    }
    finally {

      setSaving(false);

    }
  };

  /* ADD THESE 3 CONSTANTS HERE */

  const totalPayroll =
    employees.reduce(
      (acc: number, emp: any) =>
        acc + (emp.salary || 0),
      0
    );

  const managementCount =
    employees.filter(
      (e: any) => {

        const pos =
          e.position
            ?.toLowerCase() || "";

        return (

          pos.includes("manager") ||

          pos.includes("lead") ||

          pos.includes("director") ||

          pos.includes("supervisor") ||

          pos.includes("head")
        );
      }
    ).length;
  const employeeCount =
    Array.isArray(
      employees
    )
      ? employees.length
      : 0;

  if (roleLoading) {

    return null;

  }

  if (

    role !== "ADMIN" &&

    role !== "HR"

  ) {

    return (

      <AuthGuard>

        <div className="flex">

          <Sidebar />

          <div className="ml-[290px] flex items-center justify-center w-full min-h-screen">

            <div className="bg-white p-10 rounded-3xl shadow-xl text-center">

              <h2 className="text-3xl font-bold text-red-600">

                Access Denied

              </h2>

              <p className="mt-4 text-gray-500">

                You do not have permission
                to access Employees.

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="ml-[290px] w-full px-6 xl:px-8 py-7 bg-gradient-to-br from-[#eef2f7] via-[#edf3ff] to-[#e5ebf3] min-h-screen text-black overflow-x-hidden backdrop-blur-sm"        >

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

                      👥

                    </div>

                  </div>

                  {/* TEXT */}
                  <div>

                    <p className="text-sm uppercase tracking-[0.30em] text-blue-600 font-bold">

                      Enterprise ERP

                    </p>

                    <h1 className="text-4xl sm:text-5xl xl:text-[46px] font-black text-[#0f172a] tracking-tight leading-[0.95] mt-2">

                      Employees
                      <br />
                      Dashboard

                    </h1>

                    {/* TAGS */}
                    <div className="flex flex-wrap items-center gap-3 mt-4">

                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">

                        WORKFORCE MANAGEMENT

                      </div>

                      <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">

                        HR OPERATIONS

                      </div>

                      <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide hidden sm:flex">

                        ENTERPRISE TEAM

                      </div>

                    </div>

                  </div>

                </div>

                {/* DESCRIPTION */}
                <p className="text-gray-600 text-[14px] leading-relaxed max-w-2xl mt-6">

                  Manage employee records, departments,
                  organizational roles, workforce activities
                  and HR operations from one unified ERP system.

                </p>

                {/* STATUS */}
                <div className="flex flex-wrap items-center gap-3 mt-6">

                  {/* ACTIVE */}
                  <div className="flex items-center gap-2 bg-emerald-100/80 backdrop-blur-xl text-emerald-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-emerald-200 shadow-sm">

                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>

                    Workforce Active

                  </div>

                  {/* EMPLOYEES */}
                  <div className="bg-blue-100/80 backdrop-blur-xl text-blue-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-blue-200 shadow-sm">

                    {employeeCount} Employees

                  </div>

                  {/* DEPARTMENTS */}
                  <div className="bg-orange-100/80 backdrop-blur-xl text-orange-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-orange-200 shadow-sm">

                    HR Operations Enabled

                  </div>

                </div>

              </div>

              {/* RIGHT */}
              <div className="flex flex-col gap-4 xl:min-w-[340px]">

                {/* SEARCH */}
                <div className="relative">

                  <input

                    placeholder="Search employee..."
                    className="border border-white/50 pl-5 pr-5 py-4 rounded-[24px] w-full bg-white/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300 text-[15px]"
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                  />
                  {
                    search && (

                      <button
                        onClick={() =>
                          setSearch("")
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                      >

                        ✕

                      </button>
                    )
                  }

                </div>

                {/* QUICK ACTION */}
                <div className="flex items-center gap-3">

                  <div className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-4 rounded-[22px] shadow-[0_12px_30px_rgba(37,99,235,0.35)] font-semibold text-sm text-center">

                    Workforce Analytics Active

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ANALYTICS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">

            {/* TOTAL EMPLOYEES */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -6 }}
              className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 text-white rounded-[32px] px-7 py-7 shadow-xl min-h-[200px]"
            >

              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />

              <div className="relative z-10 flex items-start justify-between">

                <div>

                  <p className="text-white/80 text-sm font-medium uppercase tracking-wider">
                    Total Employees
                  </p>

                  <h2 className="text-6xl font-black mt-5">
                    {employeeCount}
                  </h2>

                  <p className="mt-4 text-white/80 text-sm">
                    Active organization workforce
                  </p>

                </div>

                <div className="bg-white/20 backdrop-blur-md p-5 rounded-3xl shadow-lg">
                  <FiUsers size={38} />
                </div>

              </div>

            </motion.div>

            {/* ADMINS */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white/80 backdrop-blur-md border border-white/40 rounded-[32px] p-7 shadow-lg min-h-[200px]"
            >

              <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold">
                Management
              </p>

              <h2 className="text-5xl font-black mt-5 text-gray-800">

                {managementCount}

              </h2>

              <p className="text-gray-500 mt-4">
                Managers & team leaders
              </p>

            </motion.div>

            {/* PAYROLL */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white/80 backdrop-blur-md border border-white/40 rounded-[32px] p-7 shadow-lg min-h-[200px]"
            >

              <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold">
                Monthly Payroll
              </p>

              <h2 className="text-4xl font-black mt-5 text-green-600 break-words">

                ₹{totalPayroll.toLocaleString()}

              </h2>

              <p className="text-gray-500 mt-4">
                Total organization salary payout
              </p>

            </motion.div>

          </div>

          {/* ADMIN FORM */}
          {(
            role === "ADMIN" ||
            role === "HR"
          ) && (
              <div className="relative overflow-hidden bg-white/80 backdrop-blur-md p-7 rounded-[32px] shadow-xl border border-white/40 mb-10">
                <h2 className={`text-3xl font-black mb-6

                  ${editingId
                    ? "text-orange-600"
                    : "text-gray-800"}
                  `}>

                  {editingId
                    ? "Editing Employee Record"
                    : "Add Employee"}

                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  <input
                    placeholder="Employee Name"
                    className="p-4 border border-gray-200 rounded-2xl bg-white/90 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <input
                    placeholder="Position"
                    className="p-4 border border-gray-200 rounded-2xl bg-white/90 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  />

                  <input
                    placeholder="Salary"
                    type="number"
                    className="p-4 border border-gray-200 rounded-2xl bg-white/90 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                  />

                </div>

                <div className="flex gap-4 mt-5">

                  <button
                    disabled={saving}
                    onClick={() => {
                      if (editingId) {

                        const confirmed =
                          window.confirm(
                            "Update employee details?"
                          );

                        if (!confirmed) return;

                        updateEmployee();

                      } else {

                        addEmployee();

                      }
                    }}
                    className={`bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg font-semibold ${ saving ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.03] active:scale-[0.98]"}`}
                  >
                    {
                      saving
                        ? "Saving..."
                        : editingId
                          ? "Update Employee"
                          : "Add Employee"
                    }

                  </button>

                  {editingId && (
                    <button
                      onClick={() => {
                        setEditingId("");
                        setName("");
                        setPosition("");
                        setSalary("");
                      }}
                      className="bg-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-semibold"
                    >
                      Cancel
                    </button>
                  )}

                </div>

              </div>

            )}

          {/* TABLE */}
          <div className="bg-white/80 backdrop-blur-md p-7 rounded-[32px] shadow-xl border border-white/40 overflow-x-auto">
            <div className="flex items-center justify-between mb-5">

              <h2 className="text-2xl font-semibold">
                Employees List
              </h2>

              <div className="text-sm text-gray-500">
                Total: {employeeCount}
              </div>

            </div>

            {/* HEADER */}
            <div className="min-w-[800px] grid grid-cols-4 border-b border-gray-200 pb-5 font-bold text-gray-500 uppercase tracking-[0.2em] text-xs">

              <div>Name</div>
              <div>Position</div>
              <div>Salary</div>
              <div>Actions</div>

            </div>


            {/* BODY */}
            {loading ? (

              <div className="space-y-4 py-4">

                <div className="h-16 bg-slate-200 rounded-2xl animate-pulse"></div>

                <div className="h-16 bg-slate-200 rounded-2xl animate-pulse"></div>

                <div className="h-16 bg-slate-200 rounded-2xl animate-pulse"></div>

                <div className="h-16 bg-slate-200 rounded-2xl animate-pulse"></div>

                <div className="h-16 bg-slate-200 rounded-2xl animate-pulse"></div>

              </div>

            ) :


              employees.length === 0 ? (

                <div className="py-14 flex flex-col items-center justify-center text-center">

                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-4xl">
                    👨‍💼
                  </div>

                  <h3 className="text-xl font-semibold text-gray-700">
                    No Employees Found
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Add employees to manage attendance and payroll.
                  </p>

                </div>

              ) : (

                employees.map((emp: any) => (

                  <div
                    key={emp.id}
                    className="min-w-[800px] grid grid-cols-4 py-5 border-b border-gray-100 items-center hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 px-4 rounded-2xl transition-all duration-300 hover:scale-[1.01]"
                  >
                    <div className="font-medium">
                      {emp.name}
                    </div>

                    <div>
                      {emp.position}
                    </div>

                    <div className="text-green-600 font-semibold">
                      ₹{
                        Number(
                          emp.salary
                        ).toLocaleString()
                      }
                    </div>

                    <div>

                      {(
                        role === "ADMIN" ||
                        role === "HR"
                      ) ?
                        (

                          <div className="flex gap-4">

                            <button
                              onClick={() => {

                                setEditingId(emp.id);

                                setName(emp.name);

                                setPosition(emp.position);

                                setSalary(
                                  emp.salary.toString()
                                );
                              }}
                              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-200 transition-all"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => {

                                const confirmDelete =
                                  window.confirm(
                                    `Delete employee "${emp.name}" ?`
                                  );

                                if (confirmDelete) {
                                  deleteEmployee(emp.id);
                                }
                              }}
                              className="bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-200 transition-all"
                            >
                              Delete
                            </button>

                          </div>

                        ) : (

                          <span className="text-gray-400 text-sm">
                            View Only
                          </span>

                        )}

                    </div>

                  </div>

                ))
              )}

          </div>

        </motion.div>

      </div >

      <style jsx global>{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #94a3b8;
    border-radius: 999px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #64748b;
  }
`}</style>

    </AuthGuard >
  );
}