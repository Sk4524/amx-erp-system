"use client";

interface Props {
  editingId: string;

  name: string;
  setName: (v: string) => void;

  email: string;
  setEmail: (v: string) => void;

  phone: string;
  setPhone: (v: string) => void;

  department: string;
  setDepartment: (v: string) => void;

  designation: string;
  setDesignation: (v: string) => void;

  employmentType: string;
  setEmploymentType: (v: string) => void;

  salary: string;
  setSalary: (v: string) => void;

  joiningDate: string;
  setJoiningDate: (v: string) => void;

  saving: boolean;

  onSubmit: () => void;
  onCancel: () => void;
}

export default function EmployeeFormModal({
  editingId,
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  department,
  setDepartment,
  designation,
  setDesignation,
  employmentType,
  setEmploymentType,
  salary,
  setSalary,
  joiningDate,
  setJoiningDate,
  saving,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-7 shadow-xl border border-white/40 mb-10">

      <h2 className="text-3xl font-black mb-6">
        {editingId ? "Edit Employee" : "Add Employee"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        <input
          className="p-4 border rounded-2xl"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="p-4 border rounded-2xl"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="p-4 border rounded-2xl"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          className="p-4 border rounded-2xl"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />

        <input
          className="p-4 border rounded-2xl"
          placeholder="Designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
        />

        <select
          className="p-4 border rounded-2xl"
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value)}
        >
          <option value="FULL_TIME">Full Time</option>
          <option value="PART_TIME">Part Time</option>
          <option value="CONTRACT">Contract</option>
          <option value="INTERN">Intern</option>
        </select>

        <input
          type="number"
          className="p-4 border rounded-2xl"
          placeholder="Salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />

        <input
          type="date"
          className="p-4 border rounded-2xl"
          value={joiningDate}
          onChange={(e) => setJoiningDate(e.target.value)}
        />

      </div>

      <div className="flex gap-4 mt-6">

        <button
          disabled={saving}
          onClick={onSubmit}
          className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-2xl font-semibold"
        >
          {saving
            ? "Saving..."
            : editingId
            ? "Update Employee"
            : "Create Employee"}
        </button>

        {editingId && (
          <button
            onClick={onCancel}
            className="bg-gray-200 px-8 py-4 rounded-2xl"
          >
            Cancel
          </button>
        )}

      </div>

    </div>
  );
}