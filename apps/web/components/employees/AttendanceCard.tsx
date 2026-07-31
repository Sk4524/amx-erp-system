"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";

export default function AttendanceCard() {
  const [employeeId, setEmployeeId] = useState("");

  const [loadingCheckIn, setLoadingCheckIn] =
    useState(false);

  const [loadingCheckOut, setLoadingCheckOut] =
    useState(false);

  const [todayAttendance, setTodayAttendance] =
    useState<any>(null);

  const loadAttendance = async () => {
    try {
      const res = await api.get("/hr/attendance/me");

      const list =
        res.data?.data ??
        [];

      if (list.length > 0) {
        setTodayAttendance(list[0]);
      }

    } catch {}
  };

  useEffect(() => {

    const id =
      localStorage.getItem("employeeId") || "";

    setEmployeeId(id);

    loadAttendance();

  }, []);

  const checkIn = async () => {

    if (!employeeId) {

      toast.error("Employee ID not found");

      return;
    }

    try {

      setLoadingCheckIn(true);

      await api.post(
        "/hr/attendance/checkin",
        {
          employeeId,
        }
      );

      toast.success("Checked In");

      loadAttendance();

    } catch (err: any) {

      toast.error(
        err?.response?.data?.message ??
        "Check In Failed"
      );

    } finally {

      setLoadingCheckIn(false);

    }

  };

  const checkOut = async () => {

    if (!employeeId) {

      toast.error("Employee ID not found");

      return;
    }

    try {

      setLoadingCheckOut(true);

      await api.put(
        "/hr/attendance/checkout",
        {
          employeeId,
        }
      );

      toast.success("Checked Out");

      loadAttendance();

    } catch (err: any) {

      toast.error(
        err?.response?.data?.message ??
        "Check Out Failed"
      );

    } finally {

      setLoadingCheckOut(false);

    }

  };

  return (

    <div className="bg-white rounded-[32px] p-7 shadow-xl border border-white/40">

      <h2 className="text-3xl font-black mb-6">

        Today's Attendance

      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        <div>

          <p className="text-gray-500">

            Status

          </p>

          <h3 className="text-2xl font-bold mt-2">

            {todayAttendance?.status || "Not Checked In"}

          </h3>

        </div>

        <div>

          <p className="text-gray-500">

            Working Hours

          </p>

          <h3 className="text-2xl font-bold mt-2">

            {todayAttendance?.workingHours || 0} hrs

          </h3>

        </div>

        <div className="flex gap-3 items-end">

          <button

            disabled={loadingCheckIn}

            onClick={checkIn}

            className="bg-green-600 text-white px-5 py-3 rounded-xl"

          >

            {loadingCheckIn ? "Checking..." : "Check In"}

          </button>

          <button

            disabled={loadingCheckOut}

            onClick={checkOut}

            className="bg-blue-600 text-white px-5 py-3 rounded-xl"

          >

            {loadingCheckOut ? "Checking..." : "Check Out"}

          </button>

        </div>

      </div>

    </div>

  );

}