
"use client";

import toast from "react-hot-toast";

import {
  FiUsers,
  FiShield,
  FiUserCheck,
} from "react-icons/fi";

import { motion } from "framer-motion";

import Sidebar from "../../components/Sidebar";
import AuthGuard from "../../components/AuthGuard";

import {
  useEffect,
  useState,
} from "react";

import api from "../../lib/api";

export default function UsersPage() {

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("EMPLOYEE");

  const [currentRole, setCurrentRole] = useState("");
  const [search, setSearch] = useState("");

  const currentUserId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId")
      : null;
  useEffect(() => {

    const role =
      localStorage.getItem("role");

    if (role) {

      setCurrentRole(role);
    }

  }, []);


  const fetchUsers = async () => {

    try {

      setLoading(true);

      const res =
        await api.get("/users");

      if (Array.isArray(res.data)) {

        setUsers(res.data);

      } else if (res.data?.data) {

        setUsers(res.data.data);

      } else {

        setUsers([]);
      }

    } catch {

      toast.error(
        "Failed to load users"
      );

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {

    if (currentRole === "ADMIN") {
      fetchUsers();
    }

  }, [currentRole]);


  const createUser = async () => {

    if (!email.trim()) {

      return toast.error(
        "Email required"
      );
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        email.trim()
      )
    ) {

      return toast.error(
        "Invalid Email"
      );
    }

    if (!password.trim()) {

      return toast.error(
        "Password required"
      );
    }

    if (
      password.length < 6
    ) {

      return toast.error(
        "Password must be at least 6 characters"
      );
    }

    try {
      setSaving(true);

      await api.post("/users", {
        email,
        password,
        role: selectedRole,
      });
      toast.success("User Created");

      setEmail("");
      setPassword("");
      setSelectedRole(
        "EMPLOYEE"
      );
      fetchUsers();

    } catch (err: any) {


      toast.error(
        err?.response?.data?.message ||
        "Create User Failed"
      );
    }
    finally {

      setSaving(false);

    }
  };

  const changeRole = async (
    id: string,
    newRole: string
  ) => {

    try {

      await api.put(
        `/users/${id}/role`,
        {
          role: newRole,
        }
      );

      toast.success("Role Updated");

      fetchUsers();

    } catch (err) {


      toast.error("Role Update Failed");
    }
  };

  const disableUser = async (
    id: string
  ) => {

    try {

      await api.put(
        `/users/${id}/disable`
      );

      toast.success("User Disabled");

      fetchUsers();

    } catch (err) {


      toast.error("Disable Failed");
    }
  };

  const enableUser = async (
    id: string
  ) => {

    try {

      await api.put(
        `/users/${id}/enable`
      );

      toast.success(
        "User Enabled"
      );

      fetchUsers();

    } catch (err) {


      toast.error(
        "Enable Failed"
      );
    }
  };

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (u: any) => u.isActive
  ).length;

  const disabledUsers = users.filter(
    (u: any) => !u.isActive
  ).length;

  const adminUsers = users.filter(
    (u: any) => u.role === "ADMIN"
  ).length;

  const filteredUsers =
  users.filter((user: any) =>

    (user.email || "")
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )

    ||

    (user.role || "")
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )
  );


  if (
    currentRole &&
    currentRole !== "ADMIN"
  ) {

    return (

      <AuthGuard>

        <div className="flex">

          <Sidebar />

          <div className="ml-[290px] flex items-center justify-center w-full min-h-screen">

            <div className="bg-white p-10 rounded-3xl shadow-xl text-center">

              <h2 className="text-3xl font-bold text-red-600">

                Access Denied

              </h2>

              <p className="mt-4 text-gray-500">

                Only administrators can access User Management.

              </p>

            </div>

          </div>

        </div>

      </AuthGuard>

    );
  }

  return (

    <AuthGuard>

      <div className="flex">

        <Sidebar />
        <div className="ml-[290px] w-full px-6 xl:px-8 py-7 bg-gradient-to-br from-[#eef2f7] via-[#edf3ff] to-[#e5ebf3] min-h-screen text-black overflow-x-hidden">

          {/* HEADER */}
          <div className="relative overflow-hidden bg-white/75 backdrop-blur-2xl border border-white/50 shadow-[0_20px_70px_rgba(0,0,0,0.08)] rounded-[36px] p-6 xl:p-7 mb-10">

            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-cyan-50/30" />

            <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl"></div>

            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl"></div>

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500"></div>

            <div className="relative z-10">

              <div className="flex items-start gap-4">

                <div className="relative">

                  <div className="absolute inset-0 bg-cyan-500/30 blur-2xl rounded-full"></div>

                  <div className="relative bg-gradient-to-br from-blue-600 via-cyan-500 to-sky-400 text-white p-4 rounded-[28px]">

                    👤

                  </div>

                </div>

                <div>

                  <p className="text-sm uppercase tracking-[0.30em] text-blue-600 font-bold">

                    Enterprise ERP

                  </p>

                  <h1 className="text-4xl sm:text-5xl xl:text-[46px] font-black text-[#0f172a] tracking-tight mt-2">

                    User Management

                  </h1>

                  <div className="flex flex-wrap gap-3 mt-4">

                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full">

                      ACCESS CONTROL

                    </div>

                    <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full">

                      ROLE MANAGEMENT

                    </div>

                  </div>

                </div>

              </div>

              <p className="text-gray-600 text-[14px] mt-6 max-w-2xl">

                Manage enterprise users, roles, permissions and security from one centralized dashboard.

              </p>

              <div className="mt-6 max-w-md">

                <input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  className="w-full p-4 rounded-2xl border border-white/50 bg-white/80 backdrop-blur-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100"
                />

              </div>

            </div>

          </div>

          {/* ANALYTICS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

            <motion.div
              whileHover={{ y: -6 }}
              className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 text-white rounded-[32px] px-7 py-7 shadow-xl min-h-[200px]"
            >

              <div className="flex justify-between">

                <div>

                  <p className="text-white/80 text-sm">
                    Total Users
                  </p>

                  <h2 className="text-6xl font-black mt-5">
                    {totalUsers}
                  </h2>

                </div>

                <div className="bg-white/20 p-5 rounded-3xl">
                  <FiUsers size={38} />
                </div>

              </div>

            </motion.div>

            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white/80 backdrop-blur-md border border-white/40 rounded-[32px] p-7 shadow-lg min-h-[200px]"
            >

              <p className="text-gray-500 text-sm uppercase">
                Active Users
              </p>

              <h2 className="text-5xl font-black mt-5 text-green-600">
                {activeUsers}
              </h2>

            </motion.div>

            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white/80 backdrop-blur-md border border-white/40 rounded-[32px] p-7 shadow-lg min-h-[200px]"
            >

              <p className="text-gray-500 text-sm uppercase">
                Admin Accounts
              </p>

              <h2 className="text-5xl font-black mt-5 text-violet-600">
                {adminUsers}
              </h2>

            </motion.div>

            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white/80 backdrop-blur-md border border-white/40 rounded-[32px] p-7 shadow-lg min-h-[200px]"
            >

              <p className="text-gray-500 text-sm uppercase">
                Disabled Users
              </p>

              <h2 className="text-5xl font-black mt-5 text-red-600">
                {disabledUsers}
              </h2>

            </motion.div>

          </div>

          {/* CREATE USER */}
          {currentRole === "ADMIN" && (
            <div className="relative overflow-hidden bg-white/80 backdrop-blur-md p-7 rounded-[32px] shadow-xl border border-white/40 mb-10">

              <h2 className="text-3xl font-black mb-6 text-gray-800">

                Create User

              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <input
                  placeholder="Email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="p-4 border border-gray-200 rounded-2xl bg-white/90"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="p-4 border border-gray-200 rounded-2xl bg-white/90"
                />

                <select
                  value={selectedRole}
                  onChange={(e) =>
                    setSelectedRole(e.target.value)
                  }
                  className="p-4 border border-gray-200 rounded-2xl bg-white/90"
                >
                  <option value="EMPLOYEE">EMPLOYEE</option>
                  <option value="HR">HR</option>
                  <option value="FINANCE">FINANCE</option>
                  <option value="SALES">SALES</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>

              </div>

              <button
                disabled={saving}
                onClick={createUser}
                className="mt-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-2xl shadow-lg font-semibold"
              >

                {
                  saving
                    ? "Creating..."
                    : "Create User"
                }

              </button>

            </div>

          )}


          {loading ? (

            <div className="bg-white/80 backdrop-blur-md p-7 rounded-[32px] shadow-xl border border-white/40">

              <div className="animate-pulse space-y-4">

                <div className="h-10 bg-slate-200 rounded-xl"></div>

                <div className="h-10 bg-slate-200 rounded-xl"></div>

                <div className="h-10 bg-slate-200 rounded-xl"></div>

                <div className="h-10 bg-slate-200 rounded-xl"></div>

                <div className="h-10 bg-slate-200 rounded-xl"></div>

              </div>
            </div>


          ) : (


            <div className="bg-white/80 backdrop-blur-md p-7 rounded-[32px] shadow-xl border border-white/40 overflow-x-auto">

              <div className="flex items-center justify-between mb-5">

                <h2 className="text-2xl font-semibold">

                  Users List

                </h2>

                <div className="text-sm text-gray-500">

                  Total: {users.length}

                </div>

              </div>

              <div className="min-w-[950px] grid grid-cols-6 border-b border-gray-200 pb-5 font-bold text-gray-500 uppercase tracking-[0.2em] text-xs">
                <div>Email</div>
                <div>Role</div>
                <div>Status</div>
                <div>Last Login</div>
                <div>Change Role</div>
                <div>Action</div>

              </div>
              {filteredUsers.length === 0 ? (

                <div className="py-16 text-center">

                  <h3 className="text-2xl font-bold text-slate-700">

                    No Users Found

                  </h3>

                  <p className="text-slate-500 mt-2">

                    Try changing your search criteria.

                  </p>

                </div>


              ) : (

                filteredUsers.map((user: any) => (

                  <div
                    key={user.id}
                    className="min-w-[950px] grid grid-cols-6 gap-4 py-5 border-b border-gray-100 items-center hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 px-4 rounded-2xl transition-all duration-300"
                  >

                    <div>
                      {user.email}
                    </div>

                    <div>
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                        {user.role}
                      </span>

                    </div>

                    <div>

                      {user.isActive ? (

                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          ACTIVE
                        </span>

                      ) : (

                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                          DISABLED
                        </span>

                      )}

                    </div>

                    <div className="text-sm text-gray-600">

                      {user.lastLogin
                        ? new Date(
                          user.lastLogin
                        ).toLocaleString()
                        : "Never"}

                    </div>

                    <div>

                      {currentRole === "ADMIN" &&
                        user.id !== currentUserId ? (

                        <select
                          value={user.role}
                          onChange={(e) => {

                            const newRole =
                              e.target.value;

                            const confirmed =
                              window.confirm(
                                `Change role of ${user.email} to ${newRole}?`
                              );

                            if (!confirmed) {
                              return;
                            }

                            changeRole(
                              user.id,
                              newRole
                            );

                          }}
                          className="border border-gray-200 rounded-xl px-3 py-2 bg-white"
                        >

                          <option value="EMPLOYEE">
                            EMPLOYEE
                          </option>

                          <option value="HR">
                            HR
                          </option>

                          <option value="FINANCE">
                            FINANCE
                          </option>

                          <option value="SALES">
                            SALES
                          </option>

                          <option value="MANAGER">
                            MANAGER
                          </option>

                          <option value="ADMIN">
                            ADMIN
                          </option>

                        </select>

                      ) : (

                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">

                          {user.role}

                        </span>

                      )}

                    </div>

                    <div>

                      {user.id !== currentUserId && (

                        user.isActive ? (

                          <button
                            onClick={() => {

                              const confirmDisable =
                                window.confirm(
                                  `Disable ${user.email}?`
                                );

                              if (!confirmDisable) {
                                return;
                              }

                              disableUser(user.id);

                            }}
                            className="bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-200"
                          >

                            Disable

                          </button>

                        ) : (

                          <button
                            onClick={() => {

                              const confirmEnable =
                                window.confirm(
                                  `Enable ${user.email}?`
                                );

                              if (!confirmEnable) {
                                return;
                              }

                              enableUser(user.id);

                            }}
                            className="bg-green-100 text-green-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-200"
                          >

                            Enable

                          </button>

                        )

                      )}

                    </div>
                  </div>

                ))

              )}

            </div>
          )}
        </div>

      </div>

    </AuthGuard >
  );
}