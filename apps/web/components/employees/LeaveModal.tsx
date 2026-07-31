"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LeaveModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async () => {
    if (!reason || !startDate || !endDate) {
      toast.error("Please fill all fields");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      toast.error("End date cannot be before start date");
      return;
    }

    try {
      setLoading(true);

      await api.post("/hr/leave", {
        reason,
        startDate,
        endDate,
      });

      toast.success("Leave applied successfully");

      setReason("");
      setStartDate("");
      setEndDate("");

      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to apply leave"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center">

      <div className="bg-white rounded-3xl shadow-2xl w-[500px] p-8">

        <h2 className="text-3xl font-bold mb-6">
          Apply Leave
        </h2>

        <div className="space-y-5">

          <input
            className="w-full border rounded-xl p-3"
            placeholder="Reason"
            value={reason}
            onChange={(e) =>
              setReason(e.target.value)
            }
          />

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="text-sm">
                Start Date
              </label>

              <input
                type="date"
                className="w-full border rounded-xl p-3"
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
              />

            </div>

            <div>

              <label className="text-sm">
                End Date
              </label>

              <input
                type="date"
                className="w-full border rounded-xl p-3"
                value={endDate}
                onChange={(e) =>
                  setEndDate(e.target.value)
                }
              />

            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4">

            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-gray-200"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={submit}
              className="px-5 py-3 rounded-xl bg-blue-600 text-white"
            >
              {loading ? "Submitting..." : "Apply"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}