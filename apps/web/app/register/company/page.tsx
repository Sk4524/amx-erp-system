"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import toast from "react-hot-toast";

import {
  Building2,
  Mail,
  LockKeyhole,
  User,
  Phone,
  Briefcase,
  MapPin,
} from "lucide-react";

export default function CompanyRegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    tenantName: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    industry: "",
    address: "",
  });

  const updateField = (
    key: string,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const registerCompany = async () => {
    try {
      setLoading(true);

      const res = await api.post(
        "/auth/register",
        {
          ...form,
          role: "ADMIN",
        }
      );

      const companyCode =
        res.data?.data?.tenant?.companyCode;

      toast.success(
        "Company Registered Successfully"
      );

      alert(
        `Company Code : ${companyCode}\n\nSave this code.\nEmployees will use it during registration.`
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

          <div className="inline-flex p-5 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white mb-5">

            <Building2 size={36}/>
          </div>

          <h1 className="text-4xl font-bold text-white">

            Create Company

          </h1>

          <p className="text-white/70 mt-3">

            Register your organization and create the first Administrator account.

          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <Input
            icon={<Building2 size={18}/>}
            placeholder="Company Name"
            value={form.tenantName}
            onChange={(v: string) => updateField("tenantName", v)}
          />

          <Input
            icon={<User size={18}/>}
            placeholder="Admin Name"
            value={form.name}
            onChange={(v: string) => updateField("name", v)}
          />

          <Input
            icon={<Mail size={18}/>}
            placeholder="Business Email"
            value={form.email}
            onChange={(v: string) => updateField("email", v)}
          />

          <Input
            type="password"
            icon={<LockKeyhole size={18}/>}
            placeholder="Password"
            value={form.password}
            onChange={(v: string) => updateField("password", v)}
          />

          <Input
            icon={<Phone size={18}/>}
            placeholder="Phone"
            value={form.phone}
            onChange={(v: string) => updateField("phone", v)}
          />

          <Input
            icon={<Briefcase size={18}/>}
            placeholder="Industry"
            value={form.industry}
            onChange={(v: string) => updateField("industry", v)}
          />

        </div>

        <div className="mt-5">

          <Input
            icon={<MapPin size={18}/>}
            placeholder="Company Address"
            value={form.address}
            onChange={(v: string) => updateField("address", v)}
          />

        </div>

        <button
          disabled={loading}
          onClick={registerCompany}
          className="mt-8 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 font-semibold"
        >
          {loading
            ? "Creating Company..."
            : "Create Company"}
        </button>

      </div>

    </div>
  );
}

type InputProps = {
  icon: React.ReactNode;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: string;
};

function Input({
  icon,
  value,
  placeholder,
  onChange,
  type = "text",
}: InputProps) {

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