"use client";

import { useEffect, useState }
  from "react";

import Sidebar
  from "../../components/Sidebar";

import AuthGuard
  from "../../components/AuthGuard";

import api
  from "../../lib/api";

import toast
  from "react-hot-toast";

import {
  Truck,
  Building2,
  Phone,
  Mail,
  Trash2,
  Pencil,
  Search,
  BadgeCheck,
} from "lucide-react";

export default function VendorsPage() {

  const [vendors,
    setVendors] =
    useState<any[]>([]);

  const [loading,
    setLoading] =
    useState(true);

  const [creating,
    setCreating] =
    useState(false);

  const [role,
    setRole] =
    useState("");

  // FORM
  const [name,
    setName] =
    useState("");

  const [company,
    setCompany] =
    useState("");

  const [email,
    setEmail] =
    useState("");

  const [phone,
    setPhone] =
    useState("");

  const [address,
    setAddress] =
    useState("");

  const [search,
    setSearch] =
    useState("");

  const [filter,
    setFilter] =
    useState("ALL");

  const [editingVendor,
    setEditingVendor] =
    useState<any>(null);

  const [showEditModal,
    setShowEditModal] =
    useState(false);


  // ROLE
  useEffect(() => {

    const savedRole =
      localStorage.getItem(
        "role"
      );

    if (savedRole) {

      setRole(savedRole);
    }

  }, []);

  // FETCH
  const fetchVendors =
    async () => {

      try {

        const res =
          await api.get(
            "/vendors"
          );

        setVendors(
          res.data.data || []
        );

      } catch (err) {

        console.log(err);

        toast.error(
          "Failed to load vendors"
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    let mounted = true;

    if (mounted) {
      fetchVendors();
    }

    return () => {
      mounted = false;
    };

  }, []);

  // CREATE
  const createVendor =
    async () => {

      // VALIDATION
      if (
        !name.trim() ||
        !company.trim() ||
        !email.trim()
      ) {

        return toast.error(
          "Name, Company and Email are required"
        );
      }

      try {
        setCreating(true);

        await api.post(
          "/vendors",
          {
            name,
            company,
            email,
            phone,
            address,
          }
        );

        // RESET
        setName("");
        setCompany("");
        setEmail("");
        setPhone("");
        setAddress("");

        await fetchVendors();

        toast.success(
          "Vendor added successfully"
        );

      } catch (err) {

        console.log(err);

        toast.error(
          "Creation failed"
        );

      } finally {

        setCreating(false);

      }
    };

  const updateVendor =
    async () => {

      if (!editingVendor) {
        return;
      }

      try {

        await api.put(

          `/vendors/${editingVendor.id}`,

          {
            name:
              editingVendor.name,

            company:
              editingVendor.company,

            email:
              editingVendor.email,

            phone:
              editingVendor.phone,

            address:
              editingVendor.address,

            status:
              editingVendor.status,
          }
        );

        toast.success(
          "Vendor updated"
        );

        setShowEditModal(false);

        setEditingVendor(null);

        await fetchVendors();

      } catch (err) {

        console.log(err);

        toast.error(
          "Update failed"
        );
      }
    };


  // DELETE
  const deleteVendor =
    async (id: string) => {

      try {

        await api.delete(
          `/vendors/${id}`
        );

        await fetchVendors();

        toast.success(
          "Vendor removed"
        );

      } catch (err) {

        console.log(err);

        toast.error(
          "Delete failed"
        );
      }
    };

  const filteredVendors =
    vendors.filter(
      (vendor: any) => {

        const matchesSearch =

          vendor.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          vendor.company
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesFilter =

          filter === "ALL"

            ? true

            : vendor.status === filter;

        return (
          matchesSearch &&
          matchesFilter
        );
      }
    );

  const getStatusStyle =
    (status: string) => {

      switch (status) {

        case "ACTIVE":

          return "bg-emerald-100 text-emerald-700 border border-emerald-200";

        case "INACTIVE":

          return "bg-yellow-100 text-yellow-700 border border-yellow-200";

        case "BLOCKED":

          return "bg-red-100 text-red-700 border border-red-200";

        default:

          return "bg-slate-100 text-slate-700 border border-slate-200";
      }
    };

  return (

    <AuthGuard>

      <div className="flex">

        <Sidebar />

        <div className="w-full lg:ml-[290px] min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 lg:p-8 overflow-x-hidden">

          {/* HEADER */}
          <div className="relative overflow-hidden bg-white/75 backdrop-blur-2xl border border-white/50 shadow-[0_20px_70px_rgba(0,0,0,0.08)] rounded-[36px] p-6 xl:p-7 mb-10">

            {/* PREMIUM OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-cyan-50/30 pointer-events-none"></div>

            {/* GLOW EFFECTS */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl"></div>

            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-sky-400/20 rounded-full blur-3xl"></div>

            {/* TOP BORDER */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500"></div>

            {/* CONTENT */}
            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

              {/* LEFT */}
              <div className="flex-1 max-w-3xl">

                {/* TITLE */}
                <div className="flex items-start gap-4">

                  {/* ICON */}
                  <div className="relative">

                    <div className="absolute inset-0 bg-cyan-500/30 blur-2xl rounded-full"></div>

                    <div className="relative bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-500 text-white p-4 rounded-[28px] shadow-[0_15px_35px_rgba(14,165,233,0.35)] border border-white/20">

                      🚚

                    </div>

                  </div>

                  {/* TEXT */}
                  <div>

                    <p className="text-sm uppercase tracking-[0.30em] text-cyan-600 font-bold">

                      Enterprise ERP

                    </p>

                    <h1 className="text-4xl sm:text-5xl xl:text-[56px] font-black text-[#0f172a] tracking-tight leading-[0.95] mt-2">

                      Vendor
                      <br />
                      Management

                    </h1>

                    {/* TAGS */}
                    <div className="flex flex-wrap items-center gap-3 mt-4">

                      <div className="bg-gradient-to-r from-cyan-500 to-sky-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">

                        PROCUREMENT SYSTEM

                      </div>

                      <div className="bg-gradient-to-r from-sky-500 to-blue-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">

                        SUPPLIER NETWORK

                      </div>

                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide hidden sm:flex">

                        ENTERPRISE SOURCING

                      </div>

                    </div>

                  </div>

                </div>

                {/* DESCRIPTION */}
                <p className="text-gray-600 text-[17px] leading-relaxed max-w-2xl mt-6">

                  Manage suppliers, procurement operations,
                  vendor partnerships and enterprise sourcing
                  workflows through one unified ERP ecosystem.

                </p>

                {/* STATUS */}
                <div className="flex flex-wrap items-center gap-3 mt-6">

                  {/* ACTIVE */}
                  <div className="flex items-center gap-2 bg-emerald-100/80 backdrop-blur-xl text-emerald-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-emerald-200 shadow-sm">

                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>

                    Procurement Active

                  </div>

                  {/* SUPPLIERS */}
                  <div className="bg-cyan-100/80 backdrop-blur-xl text-cyan-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-cyan-200 shadow-sm">

                    Supplier Management Enabled

                  </div>

                  {/* SOURCING */}
                  <div className="bg-blue-100/80 backdrop-blur-xl text-blue-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-blue-200 shadow-sm">

                    Enterprise Sourcing Connected

                  </div>

                </div>

              </div>

              {/* RIGHT */}
              <div className="hidden xl:flex items-center justify-center">

                <div className="relative">

                  <div className="absolute inset-0 bg-cyan-400/20 blur-3xl rounded-full"></div>

                  <div className="relative w-52 h-52 rounded-full bg-gradient-to-br from-cyan-500/10 via-sky-500/10 to-blue-500/10 border border-white/30 backdrop-blur-2xl flex items-center justify-center">

                    <div className="text-[80px]">

                      🚚

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ANALYTICS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-3xl p-6 shadow-xl">

              <p className="text-white/80">
                Total Vendors
              </p>

              <h2 className="text-5xl font-black mt-3">
                {vendors.length}
              </h2>

            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-3xl p-6 shadow-xl">

              <p className="text-white/80">
                Active Vendors
              </p>

              <h2 className="text-5xl font-black mt-3">

                {
                  vendors.filter(
                    (v) =>
                      v.status ===
                      "ACTIVE"
                  ).length
                }

              </h2>

            </div>
            <div className="bg-gradient-to-r from-red-500 to-orange-400 text-white rounded-3xl p-6 shadow-xl">

              <p className="text-white/80">
                Blocked Vendors
              </p>

              <h2 className="text-5xl font-black mt-3">

                {
                  vendors.filter(
                    (v) =>
                      v.status ===
                      "BLOCKED"
                  ).length
                }

              </h2>

            </div>
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-3xl p-6 shadow-xl">

              <p className="text-white/80">
                Procurement Status
              </p>

              <h2 className="text-3xl font-black mt-5">
                HEALTHY
              </h2>

            </div>

          </div>

          {/* SEARCH + FILTER */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[30px] p-5 shadow-xl mb-8">

            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

              {/* SEARCH */}
              <div className="relative w-full xl:w-[420px]">

                <Search
                  size={18}
                  className="absolute left-4 top-4 text-slate-400"
                />

                <input
                  placeholder="Search vendors or companies..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

              </div>

              {/* FILTERS */}
              <div className="flex flex-wrap gap-3">

                {[
                  "ALL",
                  "ACTIVE",
                  "INACTIVE",
                  "BLOCKED",
                ].map((item) => (

                  <button
                    key={item}
                    onClick={() =>
                      setFilter(item)
                    }
                    className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300

          ${filter === item

                        ? "bg-cyan-500 text-white shadow-lg"

                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }
          `}
                  >

                    {item}

                  </button>

                ))}

              </div>

            </div>

          </div>

          {/* FORM */}
          {role === "ADMIN" && (

            <div className="relative overflow-hidden bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[36px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] mb-10">

              {/* BACKGROUND GLOW */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/10 blur-3xl rounded-full"></div>

              <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 blur-3xl rounded-full"></div>

              {/* TOP BORDER */}
              <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600"></div>

              <div className="relative z-10 p-7 xl:p-8">

                {/* HEADER */}
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">

                  {/* LEFT */}
                  <div className="flex items-start gap-4">

                    {/* ICON */}
                    <div className="relative">

                      <div className="absolute inset-0 bg-cyan-500/30 blur-2xl rounded-full"></div>

                      <div className="relative w-16 h-16 rounded-[24px] bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 flex items-center justify-center text-white shadow-[0_15px_35px_rgba(14,165,233,0.35)]">

                        <Truck size={28} />

                      </div>

                    </div>

                    {/* TEXT */}
                    <div>

                      <p className="text-[11px] uppercase tracking-[0.30em] text-cyan-600 font-bold">

                        Enterprise Procurement

                      </p>

                      <h2 className="text-4xl font-black text-slate-800 tracking-tight mt-2">

                        Add Vendor

                      </h2>

                      <p className="text-slate-500 mt-3 max-w-xl leading-relaxed">

                        Register suppliers, procurement partners and enterprise sourcing vendors into your ERP ecosystem.

                      </p>

                    </div>

                  </div>

                  {/* BADGE */}
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-3 rounded-2xl shadow-lg">

                    <p className="text-xs uppercase tracking-[0.20em] text-white/80 font-bold">

                      SCM MODULE

                    </p>

                    <h3 className="font-bold mt-1">

                      Vendor Registration

                    </h3>

                  </div>

                </div>

                {/* FORM GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* VENDOR NAME */}
                  <div>

                    <label className="text-sm font-bold text-slate-700 mb-2 block">

                      Vendor Name

                    </label>

                    <input
                      placeholder="Raj Suppliers"
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl px-5 py-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm transition-all"
                      value={name}
                      onChange={(e) =>
                        setName(
                          e.target.value
                        )
                      }
                    />

                  </div>

                  {/* COMPANY */}
                  <div>

                    <label className="text-sm font-bold text-slate-700 mb-2 block">

                      Company

                    </label>

                    <input
                      placeholder="Raj Trading Pvt Ltd"
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl px-5 py-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm transition-all"
                      value={company}
                      onChange={(e) =>
                        setCompany(
                          e.target.value
                        )
                      }
                    />

                  </div>

                  {/* EMAIL */}
                  <div>

                    <label className="text-sm font-bold text-slate-700 mb-2 block">

                      Business Email

                    </label>

                    <div className="relative">

                      <Mail
                        size={18}
                        className="absolute left-4 top-4 text-slate-400"
                      />

                      <input
                        placeholder="vendor@company.com"
                        className="w-full rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl pl-12 pr-5 py-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm transition-all"
                        value={email}
                        onChange={(e) =>
                          setEmail(
                            e.target.value
                          )
                        }
                      />

                    </div>

                  </div>

                  {/* PHONE */}
                  <div>

                    <label className="text-sm font-bold text-slate-700 mb-2 block">

                      Contact Number

                    </label>

                    <div className="relative">

                      <Phone
                        size={18}
                        className="absolute left-4 top-4 text-slate-400"
                      />

                      <input
                        placeholder="+91 9876543210"
                        className="w-full rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl pl-12 pr-5 py-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm transition-all"
                        value={phone}
                        onChange={(e) =>
                          setPhone(
                            e.target.value
                          )
                        }
                      />

                    </div>

                  </div>

                </div>

                {/* ADDRESS */}
                <div className="mt-6">

                  <label className="text-sm font-bold text-slate-700 mb-2 block">

                    Business Address

                  </label>

                  <textarea
                    placeholder="Delhi, India"
                    className="w-full rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl px-5 py-4 text-slate-800 placeholder:text-slate-400 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm transition-all"
                    value={address}
                    onChange={(e) =>
                      setAddress(
                        e.target.value
                      )
                    }
                  />

                </div>

                {/* FOOTER */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mt-8">

                  {/* INFO */}
                  <div className="flex flex-wrap items-center gap-3">

                    <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-2xl text-sm font-semibold border border-emerald-200">

                      Procurement Ready

                    </div>

                    <div className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-2xl text-sm font-semibold border border-cyan-200">

                      Supplier Verification Enabled

                    </div>

                  </div>

                  {/* BUTTON */}
                  <button
                    onClick={createVendor}
                    disabled={creating}
                    className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-[0_15px_35px_rgba(14,165,233,0.35)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >

                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                    <span className="relative flex items-center gap-2">

                      <Truck size={18} />

                      {creating
                        ? "Creating..."
                        : "Add Vendor"}

                    </span>

                  </button>

                </div>

              </div>

            </div>

          )}
          {/* LIST */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {loading ? (

              <div className="col-span-full animate-pulse space-y-4">

                <div className="h-48 bg-white rounded-3xl animate-pulse"></div>

                <div className="h-48 bg-white rounded-3xl animate-pulse"></div>

              </div>

            ) : filteredVendors.length === 0 ? (

              <div className="bg-white rounded-3xl p-12 text-center col-span-full">

                <Truck
                  size={60}
                  className="mx-auto text-slate-300"
                />

                <h3 className="text-2xl font-bold mt-5 text-slate-700">
                  No Vendors Found
                </h3>

                <p className="text-slate-500 mt-2">
                  Try changing search or filter criteria.
                </p>

              </div>

            ) : (

              filteredVendors.map(
                (vendor: any) => (

                  <div
                    key={vendor.id}
                    className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[32px] p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex gap-4">

                        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">

                          <Building2
                            className="text-blue-600"
                          />

                        </div>

                        <div>

                          <h3 className="text-2xl font-bold text-slate-800">
                            {vendor.name}
                          </h3>

                          <p className="text-slate-500 mt-1">
                            {vendor.company}
                          </p>

                        </div>

                      </div>

                      <div className={`text-xs font-bold px-4 py-2 rounded-full ${getStatusStyle(vendor.status)}`}>

                        {vendor.status}

                      </div>

                    </div>

                    <div className="mt-6 space-y-3">

                      <div className="flex items-center gap-3 text-slate-600">

                        <Mail size={16} />

                        {vendor.email || "N/A"}

                      </div>

                      <div className="flex items-center gap-3 text-slate-600">

                        <Phone size={16} />

                        {vendor.phone || "N/A"}

                      </div>

                    </div>

                    <div className="mt-5 text-slate-500 text-sm leading-relaxed">

                      {vendor.address || "No address provided"}

                    </div>
                    <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-between">

                      {/* SCORE */}
                      <div>

                        <p className="text-xs text-slate-400 uppercase tracking-wide">

                          Vendor Score

                        </p>

                        <div className="flex items-center gap-2 mt-2">

                          <BadgeCheck
                            size={18}
                            className="text-emerald-500"
                          />

                          <span className="font-bold text-emerald-600">

                            {vendor.status === "ACTIVE"
                              ? "Verified"
                              : vendor.status}

                          </span>

                        </div>

                      </div>

                      {/* CREATED */}
                      <div className="text-right">

                        <p className="text-xs text-slate-400 uppercase tracking-wide">

                          Created

                        </p>

                        <p className="font-semibold text-slate-700 mt-2 text-sm">

                          {
                            new Date(
                              vendor.createdAt
                            ).toLocaleDateString()
                          }

                        </p>

                      </div>

                    </div>
                    {role === "ADMIN" && (

                      <div className="flex items-center gap-3 mt-6">

                        {/* EDIT */}


                        <button
                          onClick={() => {

                            setEditingVendor(
                              { ...vendor }
                            );

                            setShowEditModal(true);
                          }}
                          className="
                            flex items-center gap-2
                            bg-blue-600
                            text-white
                            px-4 py-2
                            rounded-2xl
                            hover:bg-blue-700
                            transition"
                        >

                          <Pencil size={16} />

                          Edit

                        </button>


                        {/* DELETE */}
                        <button
                          onClick={() => {

                            const confirmed =
                              window.confirm(
                                `Delete ${vendor.name}?`
                              );

                            if (!confirmed) {
                              return;
                            }

                            deleteVendor(vendor.id);

                          }}
                          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-2xl hover:bg-red-600 transition"
                        >

                          <Trash2 size={16} />

                          Remove

                        </button>

                      </div>

                    )}

                  </div>

                ))
            )}

          </div>

        </div>

      </div>

      {showEditModal && editingVendor && (

        <div className="
              fixed inset-0 z-[999]
              bg-black/50
              backdrop-blur-sm
              flex items-center
              justify-center
              p-6">

          <div className="
 text-black bg-white
  w-full
  max-w-2xl
  max-h-[90vh]
  overflow-y-auto
  rounded-[32px]
  p-8
  shadow-2xl">

            <h2 className="
              text-3xl
              font-black
              mb-6">

              Edit Vendor

            </h2>

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-5">

              <input
                value={editingVendor.name}
                onChange={(e) =>
                  setEditingVendor({
                    ...editingVendor,
                    name: e.target.value
                  })
                }
                placeholder="Vendor Name"
                className="
                  p-4
                  rounded-2xl
                  border"
              />

              <input
                value={editingVendor.company}
                onChange={(e) =>
                  setEditingVendor({
                    ...editingVendor,
                    company: e.target.value
                  })
                }
                placeholder="Company"
                className="
                p-4
                rounded-2xl
                border"
              />

              <input
                value={editingVendor.email || ""}
                onChange={(e) =>
                  setEditingVendor({
                    ...editingVendor,
                    email: e.target.value
                  })
                }
                placeholder="Email"
                className="
                  p-4
                  rounded-2xl
                  border"
              />

              <input
                value={editingVendor.phone || ""}
                onChange={(e) =>
                  setEditingVendor({
                    ...editingVendor,
                    phone: e.target.value
                  })
                }
                placeholder="Phone"
                className="
                p-4
                rounded-2xl
                border"
              />

            </div>

            <textarea
              value={
                editingVendor.address || ""
              }
              onChange={(e) =>
                setEditingVendor({
                  ...editingVendor,
                  address: e.target.value
                })
              }
              placeholder="Address"
              className="
              w-full
              mt-5
              p-4
              rounded-2xl
              border
              h-28"
            />

            <select
              value={
                editingVendor.status
              }
              onChange={(e) =>
                setEditingVendor({
                  ...editingVendor,
                  status: e.target.value
                })
              }
              className="
                    w-full
                    mt-5
                    p-4
                    rounded-2xl
                    border"
            >

              <option value="ACTIVE">
                ACTIVE
              </option>

              <option value="INACTIVE">
                INACTIVE
              </option>

              <option value="BLOCKED">
                BLOCKED
              </option>

            </select>

            <div className="
                flex
                justify-end
                gap-3
                mt-6">

              <button
                onClick={() =>
                  setShowEditModal(false)
                }
                className="
                px-6 py-3
                rounded-2xl
                bg-gray-200">

                Cancel

              </button>

              <button
                onClick={() => {

                  updateVendor();

                }}
                className=" px-6 py-3 rounded-2xl bg-blue-600 text-white">

                Save Changes

              </button>

            </div>

          </div>

        </div>

      )}

    </AuthGuard >
  );
}