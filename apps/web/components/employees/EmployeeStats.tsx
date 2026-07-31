"use client";

import { motion } from "framer-motion";
import { FiUsers } from "react-icons/fi";

interface Props {
  employeeCount: number;
  managementCount: number;
  totalPayroll: number;
}

export default function EmployeeStats({
  employeeCount,
  managementCount,
  totalPayroll,
}: Props) {
  return (
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

            <p className="text-white/80 text-sm uppercase tracking-wider">
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

      {/* MANAGEMENT */}
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
          Managers & Team Leaders
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
  );
}