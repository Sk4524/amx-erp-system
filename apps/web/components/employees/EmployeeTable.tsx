"use client";

interface Props {
  loading: boolean;
  employees: any[];
  role: string;
  onEdit: (employee: any) => void;
  onDelete: (id: string, name: string) => void;
}

export default function EmployeeTable({
  loading,
  employees,
  role,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="bg-white/80 backdrop-blur-md p-7 rounded-[32px] shadow-xl border border-white/40 overflow-x-auto">

      <div className="flex items-center justify-between mb-5">

        <h2 className="text-2xl font-semibold">
          Employees List
        </h2>

        <div className="text-sm text-gray-500">
          Total: {employees.length}
        </div>

      </div>

      {/* HEADER */}

      <div className="min-w-[1450px] grid grid-cols-9 border-b border-gray-200 pb-5 font-bold text-gray-500 uppercase tracking-[0.2em] text-xs">

        <div>Code</div>

        <div>Employee</div>

        <div>Department</div>

        <div>Designation</div>

        <div>Employment</div>

        <div>Salary</div>

        <div>Status</div>

        <div>Joining</div>

        <div>Actions</div>

      </div>

      {/* LOADING */}

      {loading ? (

        <div className="space-y-4 py-4">

          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-slate-200 rounded-2xl animate-pulse"
            />
          ))}

        </div>

      ) : employees.length === 0 ? (

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
            className="min-w-[1450px] grid grid-cols-9 py-5 border-b border-gray-100 items-center hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 px-4 rounded-2xl transition-all duration-300"
          >
            <div className="font-semibold text-blue-600">
              {emp.employeeCode ?? "-"}
            </div>

            <div>

              <div className="font-semibold">
                {emp.name}
              </div>

              <div className="text-sm text-gray-500">
                {emp.email}
              </div>

            </div>

            <div>
              {emp.department || "-"}
            </div>

            <div>
              {emp.designation || "-"}
            </div>

            <div>

              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">

                {emp.employmentType || "-"}

              </span>

            </div>

            <div className="font-semibold text-green-600">

              ₹{Number(emp.salary || 0).toLocaleString()}

            </div>

            <div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${emp.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                  }`}
              >
                {emp.status ?? "ACTIVE"}
              </span>

            </div>

            <div>

              {emp.joiningDate
                ? new Date(emp.joiningDate).toLocaleDateString()
                : "-"}

            </div>

            <div>

              {(role === "ADMIN" || role === "HR") ? (

                <div className="flex gap-2">

                  <button
                    onClick={() => onEdit(emp)}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-200"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(emp.id, emp.name)}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-200"
                  >
                    Delete
                  </button>

                </div>

              ) : (

                <span className="text-gray-400">
                  View
                </span>

              )}

            </div>
          </div>
        ))

      )}

    </div>
  );
}