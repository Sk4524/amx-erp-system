"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";

export default function PendingLeaves() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/hr/leave/pending");

      setLeaves(
        res.data?.data ??
        res.data?.data?.data ??
        []
      );
    } catch {
      toast.error("Failed to load pending leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const approveLeave = async (id: string) => {
    try {
      await api.put(`/hr/leave/${id}/approve`);

      toast.success("Leave approved");

      fetchLeaves();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
        "Approval failed"
      );
    }
  };

  const rejectLeave = async (id: string) => {
    try {
      await api.put(`/hr/leave/${id}/reject`);

      toast.success("Leave rejected");

      fetchLeaves();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
        "Reject failed"
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <div className="h-16 bg-gray-200 rounded-xl animate-pulse mb-3" />
        <div className="h-16 bg-gray-200 rounded-xl animate-pulse mb-3" />
        <div className="h-16 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">
        Pending Leave Requests
      </h2>

      {leaves.length === 0 ? (

        <div className="text-center py-8 text-gray-500">
          No pending requests
        </div>

      ) : (

        <div className="space-y-4">

          {leaves.map((leave: any) => (

            <div
              key={leave.id}
              className="border rounded-2xl p-5 flex justify-between items-center"
            >

              <div>

                <h3 className="font-semibold">
                  {leave.employee?.name ?? "Employee"}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {leave.reason}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  {new Date(
                    leave.startDate
                  ).toLocaleDateString()}
                  {" "}
                  →
                  {" "}
                  {new Date(
                    leave.endDate
                  ).toLocaleDateString()}
                </p>

              </div>

              <div className="flex gap-3">

                <button
                  onClick={() => approveLeave(leave.id)}
                  className="px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectLeave(leave.id)}
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