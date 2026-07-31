"use client";

import { useState, useEffect } from "react";

import api from "../../lib/api";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";

import toast from "react-hot-toast";

import {
  ShieldCheck,
  LockKeyhole,
  Mail,
  Building2,
} from "lucide-react";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    if (token) {
      router.replace("/");
    }

  }, [router]);

  // LOGIN
  const handleLogin = async () => {
    if (!email.trim()) {

      toast.error(
        "Email is required"
      );

      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(email)
    ) {

      toast.error(
        "Invalid email address"
      );

      return;
    }

    if (!password.trim()) {

      toast.error(
        "Password is required"
      );

      return;
    }

    if (loading)
      return;

    try {

      setLoading(true);

      const res =
        await api.post(
          "/auth/login",
          {
            email,
            password,
          }
        );


      // TOKEN

      const payload =
        res.data.data?.data ||
        res.data.data;

      const validRoles = [

        "ADMIN",
        "MANAGER",
        "HR",
        "FINANCE",
        "SALES",
        "EMPLOYEE",
      ];

      if (

        !validRoles.includes(
          payload.user.role
        )

      ) {

        toast.error(
          "Invalid role"
        );

        return;
      }

      localStorage.setItem(
        "token",
        payload.access_token
      );

      localStorage.setItem(
        "token",
        payload.access_token
      );

      localStorage.setItem(
        "userId",
        payload.user.id
      );

      localStorage.setItem(
        "role",
        payload.user.role
      );

      localStorage.setItem(
        "tenantId",
        payload.user.tenantId
      );

      localStorage.setItem(
        "name",
        payload.user.name || ""
      );

      // NEW
      if (payload.user.employeeId) {

        localStorage.setItem(
          "employeeId",
          payload.user.employeeId
        );

      }
      toast.success(
        "Login Success ✅"
      );

      switch (
      payload.user.role
      ) {

        case "ADMIN":

          router.push("/");
          break;

        case "MANAGER":

          router.push("/");
          break;

        case "HR":

          router.push("/hr");
          break;

        case "SALES":

          router.push("/sales");
          break;
        case "FINANCE":

          router.push("/finance");
          break;

        default:

          router.push("/");
      }

    } catch (err: any) {

      if (
        process.env.NODE_ENV ===
        "development"
      ) {

        console.log(err);

      }
      const errorMessage =
        typeof err?.response?.data?.message === "string"
          ? err.response.data.message
          : JSON.stringify(
            err?.response?.data?.message ||
            err?.response?.data ||
            "Login failed"
          );

      toast.error(errorMessage);
    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#6d28d9] flex items-center justify-center px-6">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] bg-cyan-400/20 rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] bg-fuchsia-500/20 rounded-full blur-3xl"></div>

      {/* LOGIN CARD */}
      <motion.div

        initial={{
          opacity: 0,
          y: 30,
          scale: 0.96,
        }}

        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}

        transition={{
          duration: 0.5,
        }}

        className="relative z-10 w-full max-w-[430px]"
      >

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-[32px] p-8">

          {/* LOGO */}
          <div className="flex items-center justify-center mb-6">

            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white p-5 rounded-3xl shadow-xl">

              <Building2 size={36} />

            </div>

          </div>

          {/* TITLE */}
          <div className="text-center mb-8">

            <h1 className="text-4xl font-bold text-white tracking-tight">

              AMX ERP

            </h1>

            <p className="text-white/70 mt-3 text-sm leading-relaxed">

              Enterprise Resource Planning System

            </p>

          </div>

          {/* EMAIL */}
          <div className="relative mb-5">

            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60"
            />

            <input
              type="email"
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !loading
                ) {

                  handleLogin();
                }
              }}
              autoComplete="email"
              placeholder="Enter Email"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>

          {/* PASSWORD */}
          <div className="relative mb-6">

            <LockKeyhole
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60"
            />

            <input
              type="password"
              onKeyDown={(e) => {

                if (
                  e.key === "Enter" &&
                  !loading
                ) {

                  handleLogin();
                }
              }}
              autoComplete="current-password"
              placeholder="Enter Password"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>

          {/* BUTTON */}
          <motion.button

            whileHover={{
              scale: 1.02,
            }}

            whileTap={{
              scale: 0.98,
            }}

            onClick={() => {

              if (loading)
                return;

              handleLogin();
            }}

            disabled={loading}

            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-2xl font-semibold shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 disabled:opacity-70"
          >

            {loading
              ? "Signing In..."
              : "Login to Dashboard"}

          </motion.button>

          {/* ACTION LINKS */}

          <div className="mt-7 space-y-4">

            <div className="flex justify-center gap-6 text-sm">

              <button
                type="button"
                onClick={() => router.push("/register/company")}
                className="text-cyan-300 hover:text-cyan-200 transition"
              >
                Create Company
              </button>

              <button
                type="button"
                onClick={() => router.push("/register/employee")}
                className="text-purple-300 hover:text-purple-200 transition"
              >
                Join Company
              </button>

            </div>

            <div className="flex items-center justify-center gap-2 text-white/70 text-sm">

              <ShieldCheck size={16} />

              Secure Enterprise Access

            </div>

          </div>

        </div>

      </motion.div>

    </div>
  );
}