"use client";

interface Props {
  employeeCount: number;
  search: string;
  setSearch: (value: string) => void;
}

export default function EmployeeHeader({
  employeeCount,
  search,
  setSearch,
}: Props) {
  return (
    <div className="relative overflow-hidden bg-white/75 backdrop-blur-2xl border border-white/50 shadow-[0_20px_70px_rgba(0,0,0,0.08)] rounded-[36px] p-6 xl:p-7 mb-10">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-cyan-50/30 pointer-events-none" />

      <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl" />

      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl" />

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500" />

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

        {/* Left */}

        <div className="flex-1 max-w-3xl">

          <div className="flex items-start gap-4">

            <div className="relative">

              <div className="absolute inset-0 bg-cyan-500/30 blur-2xl rounded-full" />

              <div className="relative bg-gradient-to-br from-blue-600 via-cyan-500 to-sky-400 text-white p-4 rounded-[28px] shadow-[0_15px_35px_rgba(37,99,235,0.35)] border border-white/20">
                👥
              </div>

            </div>

            <div>

              <p className="text-sm uppercase tracking-[0.30em] text-blue-600 font-bold">
                Enterprise ERP
              </p>

              <h1 className="text-4xl sm:text-5xl xl:text-[46px] font-black text-[#0f172a] tracking-tight leading-[0.95] mt-2">
                Employees
                <br />
                Dashboard
              </h1>

              <div className="flex flex-wrap gap-3 mt-4">

                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">
                  WORKFORCE MANAGEMENT
                </div>

                <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">
                  HR OPERATIONS
                </div>

                <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg hidden sm:flex">
                  ENTERPRISE TEAM
                </div>

              </div>

            </div>

          </div>

          <p className="text-gray-600 text-[14px] leading-relaxed max-w-2xl mt-6">
            Manage employee records, departments, organizational
            roles, workforce activities and HR operations from one
            unified ERP platform.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">

            <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-2xl font-semibold">

              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />

              Workforce Active

            </div>

            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-2xl font-semibold">
              {employeeCount} Employees
            </div>

            <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-2xl font-semibold">
              HR Operations Enabled
            </div>

          </div>

        </div>

        {/* Right */}

        <div className="flex flex-col gap-4 xl:min-w-[340px]">

          <div className="relative">

            <input
              placeholder="Search employee..."
              className="border border-white/50 pl-5 pr-5 py-4 rounded-[24px] w-full bg-white/80 backdrop-blur-xl shadow focus:outline-none focus:ring-4 focus:ring-blue-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
              >
                ✕
              </button>
            )}

          </div>

          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-4 rounded-[22px] shadow-lg font-semibold text-center">
            Workforce Analytics Active
          </div>

        </div>

      </div>

    </div>
  );
}