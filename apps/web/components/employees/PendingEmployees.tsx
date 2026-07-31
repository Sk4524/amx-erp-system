"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/api";

interface PendingEmployee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  designation?: string;
  employmentType?: string;
  createdAt?: string;
}

interface Props {
  refreshEmployees: () => void;
}

export default function PendingEmployees({
  refreshEmployees,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [pendingEmployees, setPendingEmployees] = useState<
    PendingEmployee[]
  >([]);

  const fetchPendingEmployees = async () => {
    try {
      setLoading(true);

      const res = await api.get("/employee/pending");

      const data =
        res.data?.data ??
        res.data ??
        [];

      setPendingEmployees(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to load pending employees");
    } finally {
      setLoading(false);
    }
  };

  const approveEmployee = async (id: string) => {
    try {
      await api.post(`/employee/pending/${id}/approve`);

      toast.success("Employee approved");

      fetchPendingEmployees();

      refreshEmployees();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Approval failed"
      );
    }
  };

  const rejectEmployee = async (id: string) => {
    try {
      await api.post(`/employee/pending/${id}/reject`);

      toast.success("Employee rejected");

      fetchPendingEmployees();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Reject failed"
      );
    }
  };

  useEffect(() => {
    fetchPendingEmployees();
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mt-8">

      <h2 className="text-2xl font-bold mb-5">
        Pending Employee Registrations
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : pendingEmployees.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No pending registrations
        </div>
      ) : (
        <div className="space-y-4">
          {pendingEmployees.map((emp) => (
            <div
              key={emp.id}
              className="border rounded-2xl p-5 flex justify-between items-center"
            >
              <div>
                <div className="font-semibold text-lg">
                  {emp.name}
                </div>

                <div className="text-gray-500">
                  {emp.email}
                </div>

                <div className="text-sm mt-1">
                  {emp.department} • {emp.designation}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => approveEmployee(emp.id)}
                  className="px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectEmployee(emp.id)}
                  className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}