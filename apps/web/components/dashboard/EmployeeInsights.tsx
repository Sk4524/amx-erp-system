"use client";

import { Users } from "lucide-react";

type Props = {
  employees: any[];
  isAdmin: boolean;
  isHR: boolean;
  isManager: boolean;
};

export default function EmployeeInsights({

  employees,

  isAdmin,

  isHR,

  isManager,

}: Props) {

  if (!(isAdmin || isHR || isManager))
    return null;

  // Show latest employees only
  const recentEmployees =
    [...employees]
      .reverse()
      .slice(0, 10);

  return (

    <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] relative overflow-hidden p-6 shadow-lg border border-white/50 h-[420px] flex flex-col">

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400"></div>

      <div className="flex items-center justify-between mb-4">

        <div>

          <h2 className="text-black text-[24px] font-bold">

            Recent Employees

          </h2>

          <p className="text-sm text-gray-500">

            Latest employee records

          </p>

        </div>

        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">

          {employees.length} Total

        </span>

      </div>

      <div className="space-y-4 overflow-y-auto flex-1">

        {recentEmployees.length === 0 ? (

          <div className="flex flex-col items-center justify-center h-full">

            <Users
              size={40}
              className="text-blue-500 mb-3"
            />

            <h3 className="font-bold">

              No Employees

            </h3>

            <p className="text-sm text-gray-500">

              Employee records will appear here.

            </p>

          </div>

        ) : (

          recentEmployees.map((emp: any) => (

            <div
              key={emp.id}
              className="text-black flex justify-between border rounded-2xl px-4 py-3 hover:bg-gray-50"
            >

              <div>

                <p className="font-semibold">

                  {emp.name}

                </p>

                <p className="text-sm text-gray-500">

                  {emp.position}

                </p>

              </div>

              <div className="text-right">

                <p className="font-bold text-green-600">

                  ₹{emp.salary}

                </p>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

}