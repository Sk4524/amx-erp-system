"use client";

import { Bell, Search, UserCircle2 } from "lucide-react";

export default function Navbar() {
  return (
    <div className="w-full bg-white shadow-sm border-b px-8 py-4 flex items-center justify-between">

      {/* LEFT */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Enterprise Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Welcome back to AMX ERP
        </p>
      </div>

      {/* CENTER SEARCH */}
      <div className="flex items-center bg-gray-100 px-4 py-2 rounded-xl w-[350px]">

        <Search size={18} className="text-gray-500" />

        <input
          placeholder="Search..."
          className="bg-transparent outline-none ml-3 w-full text-black"
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5">

        <div className="relative cursor-pointer">
          <Bell className="text-gray-700" />

          <div className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full" />
        </div>

        <div className="flex items-center gap-2 cursor-pointer">
          <UserCircle2 size={34} className="text-blue-600" />

          <div>
            <p className="text-sm font-semibold text-gray-800">
              Admin
            </p>

            <p className="text-xs text-gray-500">
              ERP Manager
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}