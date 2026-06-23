"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const data = [
  { month: "Jan", revenue: 40000 },
  { month: "Feb", revenue: 55000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 70000 },
  { month: "May", revenue: 65000 },
  { month: "Jun", revenue: 90000 },
];

export default function RevenueChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">

      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-800">
          Revenue Analytics
        </h2>

        <p className="text-sm text-gray-500">
          Monthly revenue performance
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>
    </div>
  );
}