"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";

export default function MyLeaves() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/hr/my-leaves");

      setLeaves(
        res.data?.data ??
        res.data?.data?.data ??
        []
      );
    } catch {
      toast.error("Failed to load leave history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const badgeColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">
        My Leave Requests
      </h2>

      {loading ? (

        <div className="space-y-3">

          <div className="h-16 bg-gray-200 animate-pulse rounded-xl" />
          <div className="h-16 bg-gray-200 animate-pulse rounded-xl" />
          <div className="h-16 bg-gray-200 animate-pulse rounded-xl" />

        </div>

      ) : leaves.length === 0 ? (

        <div className="text-center text-gray-500 py-10">
          No leave requests found.
        </div>

      ) : (

        <div className="space-y-4">

          {leaves.map((leave) => (

            <div
              key={leave.id}
              className="border rounded-2xl p-5 flex justify-between items-center"
            >

              <div>

                <h3 className="font-semibold">
                  {leave.reason}
                </h3>

                <p className="text-gray-500 text-sm mt-1">
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

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${badgeColor(
                  leave.status
                )}`}
              >
                {leave.status}
              </span>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}