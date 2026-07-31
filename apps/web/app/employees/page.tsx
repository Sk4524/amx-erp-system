"use client";

import toast from "react-hot-toast";
import {
  FiUsers,

} from "react-icons/fi";
import EmployeeFormModal from "../../components/employees/EmployeeFormModal";
import EmployeeStats from "../../components/employees/EmployeeStats";
import useRole from "../../lib/useRole";
import EmployeeTable from "../../components/employees/EmployeeTable";
import { motion } from "framer-motion";
import Sidebar from "../../components/Sidebar";
import AuthGuard from "../../components/AuthGuard";
import EmployeeHeader from "../../components/employees/EmployeeHeader";
import { useEffect, useState } from "react";

import api from "../../lib/api";

export default function EmployeesPage() {

  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [department, setDepartment] = useState("");

  const [designation, setDesignation] = useState("");

  const [employmentType, setEmploymentType] =
    useState("FULL_TIME");

  const [joiningDate, setJoiningDate] =
    useState("");
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
        `/employee?page=1&limit=1000&search=${encodeURIComponent(
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
      !email.trim() ||
      !department.trim() ||
      !designation.trim() ||
      !salary
    ) {
      toast.error("Please fill all required fields");
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

      await api.post("/employee", {
        name,
        email,
        phone,
        department,
        designation,
        employmentType,
        salary: Number(salary),
        joiningDate,
      });

      setName("");
      setEmail("");
      setPhone("");
      setDepartment("");
      setDesignation("");
      setEmploymentType("FULL_TIME");
      setSalary("");
      setJoiningDate("");
      fetchEmployees();

      toast.success("Employee Added ✅");

    } catch (err: any) {

      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Add Employee Failed");
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
      !email.trim() ||
      !department.trim() ||
      !designation.trim() ||
      !salary
    ) {
      toast.error("Please fill all required fields");
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

      await api.put(`/employee/${editingId}`, {
        name,
        email,
        phone,
        department,
        designation,
        employmentType,
        salary: Number(salary),
        joiningDate,
      });

      setEditingId("");

      setName("");
      setEmail("");
      setPhone("");
      setDepartment("");
      setDesignation("");
      setEmploymentType("FULL_TIME");
      setSalary("");
      setJoiningDate("");

      fetchEmployees();

      toast.success("Employee Updated ✅");

    } catch (err: any) {

      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Update Failed");
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
          e.designation?.toLowerCase() || "";

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
          <EmployeeHeader
            employeeCount={employeeCount}
            search={search}
            setSearch={setSearch}
          />

          {/* ANALYTICS */}
          <EmployeeStats
            employeeCount={employeeCount}
            managementCount={managementCount}
            totalPayroll={totalPayroll}
          />

          {/* ADMIN FORM */}
          <EmployeeFormModal
            editingId={editingId}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            department={department}
            setDepartment={setDepartment}
            designation={designation}
            setDesignation={setDesignation}
            employmentType={employmentType}
            setEmploymentType={setEmploymentType}
            salary={salary}
            setSalary={setSalary}
            joiningDate={joiningDate}
            setJoiningDate={setJoiningDate}
            saving={saving}
            onSubmit={() => {
              if (editingId) {
                updateEmployee();
              } else {
                addEmployee();
              }
            }}
            onCancel={() => {
              setEditingId("");

              setName("");
              setEmail("");
              setPhone("");
              setDepartment("");
              setDesignation("");
              setEmploymentType("FULL_TIME");
              setSalary("");
              setJoiningDate("");
            }}
          />

          {/* TABLE */}
          <EmployeeTable
            loading={loading}
            employees={employees}
            role={role}
            onEdit={(emp) => {

              setEditingId(emp.id);

              setName(emp.name || "");

              setEmail(emp.email || "");

              setPhone(emp.phone || "");

              setDepartment(emp.department || "");

              setDesignation(emp.designation || "");

              setEmploymentType(
                emp.employmentType || "FULL_TIME"
              );

              setSalary(
                String(emp.salary || "")
              );

              setJoiningDate(
                emp.joiningDate
                  ? emp.joiningDate.slice(0, 10)
                  : ""
              );

            }}
            onDelete={(id, employeeName) => {
              const confirmDelete = window.confirm(
                `Delete employee "${employeeName}" ?`
              );

              if (confirmDelete) {
                deleteEmployee(id);
              }
            }}
          />

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