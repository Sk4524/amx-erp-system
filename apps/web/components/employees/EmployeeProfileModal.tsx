"use client";

interface Props {
  open: boolean;
  employee: any;
  onClose: () => void;
}

export default function EmployeeProfileModal({
  open,
  employee,
  onClose,
}: Props) {
  if (!open || !employee) return null;

  const Detail = ({
    label,
    value,
  }: {
    label: string;
    value: any;
  }) => (
    <div className="bg-slate-50 rounded-2xl p-4">
      <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
        {label}
      </p>

      <p className="font-semibold text-gray-800 break-words">
        {value || "-"}
      </p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">

      <div className="bg-white w-full max-w-5xl rounded-[36px] shadow-2xl overflow-hidden">

        {/* Header */}

        <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-500 px-8 py-8 text-white flex justify-between items-start">

          <div>

            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-5xl mb-4">
              👤
            </div>

            <h2 className="text-3xl font-black">
              {employee.name}
            </h2>

            <p className="opacity-90 mt-1">
              {employee.designation || "-"}
            </p>

          </div>

          <button
            onClick={onClose}
            className="text-3xl font-bold hover:opacity-70"
          >
            ×
          </button>

        </div>

        <div className="p-8">

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

            <Detail
              label="Employee Code"
              value={employee.employeeCode}
            />

            <Detail
              label="Email"
              value={employee.email}
            />

            <Detail
              label="Phone"
              value={employee.phone}
            />

            <Detail
              label="Department"
              value={employee.department}
            />

            <Detail
              label="Designation"
              value={employee.designation}
            />

            <Detail
              label="Employment Type"
              value={employee.employmentType}
            />

            <Detail
              label="Salary"
              value={`₹${Number(
                employee.salary || 0
              ).toLocaleString()}`}
            />

            <Detail
              label="Status"
              value={employee.status}
            />

            <Detail
              label="Joining Date"
              value={
                employee.joiningDate
                  ? new Date(
                      employee.joiningDate
                    ).toLocaleDateString()
                  : "-"
              }
            />

            <Detail
              label="Created"
              value={
                employee.createdAt
                  ? new Date(
                      employee.createdAt
                    ).toLocaleString()
                  : "-"
              }
            />

            <Detail
              label="Updated"
              value={
                employee.updatedAt
                  ? new Date(
                      employee.updatedAt
                    ).toLocaleString()
                  : "-"
              }
            />

          </div>

        </div>

      </div>

    </div>
  );
}