"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import toast from "react-hot-toast";

import {
  User,
  Mail,
  LockKeyhole,
  Building2,
  Briefcase,
  BadgeCheck,
} from "lucide-react";

export default function EmployeeRegisterPage() {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    companyCode: "",
    name: "",
    email: "",
    password: "",
    department: "",
    designation: "",
    role: "EMPLOYEE",
  });

  const update = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const registerEmployee = async () => {

    try {

      setLoading(true);

      await api.post("/auth/register", form);

      toast.success(
        "Registration submitted successfully.\nPlease wait for HR/Admin approval."
      );

      router.push("/login");

    } catch (err: any) {

      toast.error(
        err?.response?.data?.message ||
        "Registration Failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#6d28d9] flex justify-center items-center px-6 py-10">

      <div className="w-full max-w-2xl rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-10">

        <div className="text-center mb-8">

          <div className="inline-flex p-5 rounded-3xl bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white mb-5">

            <BadgeCheck size={36} />

          </div>

          <h1 className="text-4xl font-bold text-white">

            Join Existing Company

          </h1>

          <p className="text-white/70 mt-3">

            Register as an employee using your Company Code.

          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <Input
            icon={<Building2 size={18}/>}
            placeholder="Company Code"
            value={form.companyCode}
            onChange={(v:any)=>update("companyCode",v)}
          />

          <Input
            icon={<User size={18}/>}
            placeholder="Full Name"
            value={form.name}
            onChange={(v:any)=>update("name",v)}
          />

          <Input
            icon={<Mail size={18}/>}
            placeholder="Email"
            value={form.email}
            onChange={(v:any)=>update("email",v)}
          />

          <Input
            type="password"
            icon={<LockKeyhole size={18}/>}
            placeholder="Password"
            value={form.password}
            onChange={(v:any)=>update("password",v)}
          />

          <Input
            icon={<Briefcase size={18}/>}
            placeholder="Department"
            value={form.department}
            onChange={(v:any)=>update("department",v)}
          />

          <Input
            icon={<Briefcase size={18}/>}
            placeholder="Designation"
            value={form.designation}
            onChange={(v:any)=>update("designation",v)}
          />

        </div>

        <button
          disabled={loading}
          onClick={registerEmployee}
          className="mt-8 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-4 font-semibold"
        >
          {loading
            ? "Registering..."
            : "Join Company"}
        </button>

      </div>

    </div>

  );

}

function Input({
  icon,
  value,
  placeholder,
  onChange,
  type="text"
}:any){

  return(

<div className="relative">

<div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">

{icon}

</div>

<input

type={type}

value={value}

placeholder={placeholder}

onChange={(e)=>onChange(e.target.value)}

className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 outline-none"

/>

</div>

);

}