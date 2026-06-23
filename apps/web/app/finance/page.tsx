"use client";

import Sidebar from "../../components/Sidebar";
import AuthGuard from "../../components/AuthGuard";
import useRole from "../../lib/useRole";

import { useEffect, useState } from "react";

import api from "../../lib/api";

import toast from "react-hot-toast";

import { motion } from "framer-motion";

export default function FinancePage() {

  const [transactions, setTransactions] =
    useState<any[]>([]);

  const [ledger, setLedger] =
    useState<any[]>([]);

  const [payables, setPayables] =
    useState<any[]>([]);

  const [receivables,
    setReceivables] =
    useState<any[]>([]);

  const [vendorName,
    setVendorName] =
    useState("");

  const [customerName,
    setCustomerName] =
    useState("");

  const [payableAmount,
    setPayableAmount] =
    useState("");

  const [receivableAmount,
    setReceivableAmount] =
    useState("");
  const [payableDueDate,
    setPayableDueDate] =
    useState("");

  const [receivableDueDate,
    setReceivableDueDate] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [type, setType] =
    useState("EXPENSE");


  const [search, setSearch] =
    useState("");


  const [loading, setLoading] =
    useState(true);

  // LOAD ROLE
  const {
    role
  } = useRole();
  // FETCH TRANSACTIONS
  const fetchTransactions = async () => {

    try {

      const res = await api.get(
        `/finance/transactions?search=${search}`
      );

      setTransactions(
        res.data.data || []
      );

    } catch (err: any) {

      console.error(err);

      setTransactions([]);

      toast.error(
        "Failed to load transactions"
      );
    }
  };

  // FETCH LEDGER
  const fetchLedger = async () => {

    try {

      const res =
        await api.get(
          "/finance/ledger"
        );

      setLedger(
        res.data.data || []
      );

    } catch (err: any) {

      console.error(err);

      setTransactions([]);

      toast.error(
        "Failed to load ledger"
      );
    }
  };

  // FETCH PAYABLES
  const fetchPayables = async () => {

    try {

      const res =
        await api.get(
          "/finance/payables"
        );

      setPayables(
        res.data.data || []
      );

    } catch (err: any) {

      console.error(err);

      setTransactions([]);

      toast.error(
        "Failed to load payables"
      );
    }
  };

  // FETCH RECEIVABLES
  const fetchReceivables = async () => {

    try {

      const res =
        await api.get(
          "/finance/receivables"
        );

      setReceivables(
        res.data.data || []
      );

    } catch (err: any) {

      console.error(err);

      setTransactions([]);

      toast.error(
        "Failed to load receivables"
      );
    }
  };

  // INITIAL LOAD
  useEffect(() => {

    if (!role) {
      return;
    }

    if (
      role !== "ADMIN" &&
      role !== "FINANCE"
    ) {
      return;
    }

    const loadData = async () => {

      setLoading(true);

      await Promise.all([
        fetchTransactions(),
        fetchLedger(),
        fetchPayables(),
        fetchReceivables(),
      ]);

      setLoading(false);
    };

    loadData();

  }, [search, role]);


  // CREATE TRANSACTION
  const createTransaction = async () => {

    if (
      !amount

    ) {

      toast.error(
        "Amount is required"
      );

      return;
    }

    try {

      await api.post(
        "/finance/transactions",
        {
          amount: Number(amount),
          type,
        }
      );
      setAmount("");

      await Promise.all([
        fetchTransactions(),
        fetchLedger(),
      ]);

      toast.success(
        "Transaction Added ✅"
      );

    } catch (err: any) {

      console.log("FULL ERROR:", err);

      console.log(
        "RESPONSE:",
        err?.response?.data
      );

      toast.error(
        err?.response?.data?.message ||
        JSON.stringify(
          err?.response?.data
        ) ||
        "Transaction Failed"
      );
    }
  };

  // DELETE TRANSACTION
  const deleteTransaction = async (
    id: string
  ) => {

    try {

      await api.delete(
        `/finance/transactions/${id}`
      );

      await Promise.all([
        fetchTransactions(),
        fetchLedger(),
      ]);

      toast.success("Deleted ✅");

    } catch (err) {


      toast.error("Delete Failed");
    }
  };

  // CREATE PAYABLE
  const createPayable = async () => {

    if (
      !vendorName.trim() ||
      !payableAmount ||
      !payableDueDate
    ) {

      toast.error(
        "All fields are required"
      );

      return;
    }

    try {
      await api.post(
        "/finance/payables",
        {
          vendorName,
          amount:
            Number(payableAmount),
          payableDueDate,
        }
      );

      setVendorName("");
      setPayableAmount("");
      setPayableDueDate("")

      await Promise.all([
        fetchPayables(),
        fetchLedger(),
      ]);

      toast.success("Payable Added ✅");

    } catch {

      toast.error("Failed");
    }
  };

  // CREATE RECEIVABLE
  const createReceivable = async () => {

    if (
      !customerName.trim() ||
      !receivableAmount ||
      !receivableDueDate
    ) {

      toast.error(
        "All fields are required"
      );

      return;
    }

    try {

      await api.post(
        "/finance/receivables",
        {
          customerName,
          amount:
            Number(
              receivableAmount
            ),
          receivableDueDate,
        }
      );

      setCustomerName("");
      setReceivableAmount("");
      setReceivableDueDate("")

      await Promise.all([
        fetchReceivables(),
        fetchLedger(),
      ]);

      toast.success("Receivable Added ✅");

    } catch {

      toast.error("Failed");
    }
  };

  // MARK PAYABLE PAID
  const markPaid = async (
    id: string
  ) => {

    try {

      await api.post(
        `/finance/payables/${id}/pay`
      );

      await Promise.all([
        fetchPayables(),
        fetchLedger(),
        fetchTransactions(),
      ]);

      toast.success("Marked Paid ✅");

    } catch (err) {

      toast.error(
        "Failed to mark paid"
      );

    }
  };

  // MARK RECEIVABLE RECEIVED
  const markReceived = async (
    id: string
  ) => {

    try {

      await api.post(
        `/finance/receivables/${id}/receive`
      );

      await Promise.all([
        fetchReceivables(),
        fetchLedger(),
        fetchTransactions(),
      ]);

      toast.success("Marked Received ✅");

    } catch (err) {

      toast.error(
        "Failed to mark received"
      );

    }
  };

  // ANALYTICS
  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((a, b) => a + b.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((a, b) => a + b.amount, 0);

  const netProfit =
    income - expense;


  if (!role) {

    return null;
  }

  return (

    <AuthGuard>

      <div className="flex">

        <Sidebar />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="ml-[290px] w-full px-6 xl:px-8 py-7 bg-gradient-to-br from-[#eef2f7] to-[#e5ebf3] min-h-screen text-black overflow-x-hidden"
        >

          {/* HEADER */}
          <div className="relative overflow-hidden bg-white/75 backdrop-blur-2xl border border-white/50 shadow-[0_20px_70px_rgba(0,0,0,0.08)] rounded-[36px] p-6 xl:p-7 mb-10">

            {/* PREMIUM OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-emerald-50/30 pointer-events-none"></div>

            {/* GLOW EFFECTS */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"></div>

            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-green-400/20 rounded-full blur-3xl"></div>

            {/* TOP BORDER */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-cyan-400"></div>

            {/* CONTENT */}
            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

              {/* LEFT */}
              <div className="flex-1 max-w-3xl">

                {/* TITLE */}
                <div className="flex items-start gap-4">

                  {/* ICON */}
                  <div className="relative">

                    <div className="absolute inset-0 bg-emerald-500/30 blur-2xl rounded-full"></div>

                    <div className="relative bg-gradient-to-br from-green-600 via-emerald-500 to-cyan-400 text-white p-4 rounded-[28px] shadow-[0_15px_35px_rgba(16,185,129,0.35)] border border-white/20">

                      💰

                    </div>

                  </div>

                  {/* TEXT */}
                  <div>

                    <p className="text-sm uppercase tracking-[0.30em] text-emerald-600 font-bold">

                      Enterprise ERP

                    </p>

                    <h1 className="text-4xl sm:text-5xl xl:text-[56px] font-black text-[#0f172a] tracking-tight leading-[0.95] mt-2">

                      Finance
                      <br />
                      Dashboard

                    </h1>

                    {/* TAGS */}
                    <div className="flex flex-wrap items-center gap-3 mt-4">

                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">

                        TRANSACTION ANALYTICS

                      </div>

                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">

                        PAYABLE MANAGEMENT

                      </div>

                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide hidden sm:flex">

                        ENTERPRISE FINANCE

                      </div>

                    </div>

                  </div>

                </div>

                {/* DESCRIPTION */}
                <p className="text-gray-600 text-[17px] leading-relaxed max-w-2xl mt-6">

                  Monitor financial transactions, manage
                  receivables & payables, track revenue streams
                  and oversee enterprise financial operations.

                </p>

                {/* STATUS */}
                <div className="flex flex-wrap items-center gap-3 mt-6">

                  {/* ACTIVE */}
                  <div className="flex items-center gap-2 bg-emerald-100/80 backdrop-blur-xl text-emerald-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-emerald-200 shadow-sm">

                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>

                    Financial Systems Active

                  </div>

                  {/* TRANSACTIONS */}
                  <div className="bg-green-100/80 backdrop-blur-xl text-green-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-green-200 shadow-sm">

                    Live Transaction Monitoring

                  </div>

                  {/* AI */}
                  <div className="bg-cyan-100/80 backdrop-blur-xl text-cyan-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-cyan-200 shadow-sm">

                    AI Financial Insights Enabled

                  </div>

                </div>

              </div>

              {/* RIGHT */}
              <div className="flex flex-col gap-4 xl:min-w-[340px]">

                {/* SEARCH */}
                <div className="relative">

                  <input
                    placeholder="Search transaction..."
                    className="border border-white/50 pl-12 pr-5 py-4 rounded-[24px] w-full bg-white/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all duration-300 text-[15px]"
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                  />

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                    />

                  </svg>

                </div>

                {/* QUICK STATUS */}
                <div className="flex items-center gap-3">

                  <div className="flex-1 bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 text-white px-5 py-4 rounded-[22px] shadow-[0_12px_30px_rgba(16,185,129,0.35)] font-semibold text-sm text-center">

                    Enterprise Financial Intelligence

                  </div>

                </div>

              </div>

            </div>

          </div>
          {/* ANALYTICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-6 mb-8">

            {[

              {
                title: "Net Profit",
                value:
                  `₹${netProfit.toLocaleString()}`,
                gradient:
                  netProfit >= 0
                    ? "from-emerald-500 to-green-400"
                    : "from-red-500 to-rose-400",
              },
              {
                title: "Total Income",
                value:
                  `₹${income.toLocaleString()}`,
                gradient: "from-green-500 to-emerald-400",
              },
              {
                title: "Total Expense",
                value:
                  `₹${expense.toLocaleString()}`,
                gradient: "from-red-500 to-orange-400",
              },
              {
                title: "Ledger Entries",
                value: ledger.length,
                gradient: "from-blue-500 to-cyan-400",
              },
              {
                title: "Payables",
                value: payables.length,
                gradient: "from-orange-500 to-amber-400",
              },
              {
                title: "Receivables",
                value: receivables.length,
                gradient: "from-purple-600 to-pink-500",
              },
            ].map((card, index) => (

              <motion.div
                key={index}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`bg-gradient-to-br ${card.gradient} text-white rounded-3xl p-6 shadow-lg min-h-[170px]`}
              >

                <div className="flex flex-col h-full justify-between">

                  <p className="text-white/90 text-lg font-medium">
                    {card.title}
                  </p>

                  <h2 className="text-5xl font-bold break-words leading-tight">
                    {card.value}
                  </h2>

                </div>

              </motion.div>

            ))}

          </div>

          {/* ADMIN FORM */}
          {role === "ADMIN" && (

            <motion.div
              whileHover={{ y: -3 }}
              className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/40 mb-8"
            >


              <h2 className="text-2xl font-bold mb-6">
                Add Transaction
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <input
                  type="number"
                  placeholder="Amount"
                  className="p-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value)
                  }
                />

                <select
                  className="p-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none"
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value)
                  }
                >

                  <option value="EXPENSE">
                    EXPENSE
                  </option>

                  <option value="INCOME">
                    INCOME
                  </option>

                </select>



              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => {

                  const confirmed =
                    window.confirm(
                      "Create transaction?"
                    );

                  if (!confirmed) {
                    return;
                  }

                  createTransaction();


                }}
                className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition-all duration-300"
              >
                Add Transaction
              </motion.button>

            </motion.div>

          )}

          {/* AP/AR SECTION */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8 items-start">

            {/* PAYABLES */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-5 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300">

              <div className="flex items-center justify-between mb-6">

                <div>

                  <h2 className="text-2xl font-bold">
                    Accounts Payable
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Vendor payment tracking
                  </p>

                </div>

                <span className="text-sm text-gray-500">
                  {payables.length} bills
                </span>

              </div>

              {role === "ADMIN" && (

                <div className="grid grid-cols-1 gap-4 mb-6">

                  <input
                    placeholder="Vendor Name"
                    className="border border-gray-200 p-3 rounded-2xl"
                    value={vendorName}
                    onChange={(e) =>
                      setVendorName(
                        e.target.value
                      )
                    }
                  />

                  <input
                    placeholder="Amount"
                    type="number"
                    className="border border-gray-200 p-3 rounded-2xl"
                    value={payableAmount}
                    onChange={(e) =>
                      setPayableAmount(
                        e.target.value
                      )
                    }
                  />

                  <input
                    type="date"
                    className="border border-gray-200 p-3 rounded-2xl"
                    value={payableDueDate}
                    onChange={(e) =>
                      setPayableDueDate(
                        e.target.value
                      )
                    }
                  />

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {

                      const confirmed =
                        window.confirm(
                          "Create payable?"
                        );

                      if (!confirmed) {
                        return;
                      }

                      createPayable();

                    }}
                    className="bg-orange-500 text-white py-3 rounded-2xl hover:bg-orange-600 transition-all duration-300"
                  >
                    Add Payable
                  </motion.button>

                </div>

              )}

              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">

                {payables.length === 0 ? (

                  <div className="py-10 text-center">

                    <div className="text-4xl mb-3">
                      📄
                    </div>

                    <p className="text-gray-500">
                      No payables found
                    </p>

                  </div>

                ) : (

                  payables.map((item: any) => (

                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      key={item.id}
                      className="border border-gray-100 rounded-2xl p-4 flex items-center justify-between bg-white/70 hover:bg-white transition-all duration-200"
                    >

                      <div>

                        <p className="font-semibold text-[#111827]">
                          {item.vendorName}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          Due:
                          {" "}
                          {new Date(
                            item.dueDate
                          ).toLocaleDateString()}
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="font-bold text-orange-600 text-lg">
                          ₹{item.amount}
                        </p>

                        <div className="mt-2">

                          {item.status ===
                            "PAID" ? (

                            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                              PAID
                            </span>

                          ) : (

                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              whileHover={{ scale: 1.05 }}
                              onClick={() => {

                                const confirmed =
                                  window.confirm(
                                    "Mark this payable as paid?"
                                  );

                                if (!confirmed) {
                                  return;
                                }

                                markPaid(item.id);
                              }}
                              className="text-sm bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition"
                            >
                              Mark Paid
                            </motion.button>

                          )}

                        </div>

                      </div>

                    </motion.div>

                  ))

                )}

              </div>

            </div>

            {/* RECEIVABLES */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-5 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300">

              <div className="flex items-center justify-between mb-6">

                <div>

                  <h2 className="text-2xl font-bold">
                    Accounts Receivable
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Customer invoice tracking
                  </p>

                </div>

                <span className="text-sm text-gray-500">
                  {receivables.length} invoices
                </span>

              </div>

              {role === "ADMIN" && (

                <div className="grid grid-cols-1 gap-4 mb-6">

                  <input
                    placeholder="Customer Name"
                    className="border border-gray-200 p-3 rounded-2xl"
                    value={customerName}
                    onChange={(e) =>
                      setCustomerName(
                        e.target.value
                      )
                    }
                  />

                  <input
                    placeholder="Amount"
                    type="number"
                    className="border border-gray-200 p-3 rounded-2xl"
                    value={receivableAmount}
                    onChange={(e) =>
                      setReceivableAmount(
                        e.target.value
                      )
                    }
                  />

                  <input
                    type="date"
                    className="border border-gray-200 p-3 rounded-2xl"
                    value={receivableDueDate}
                    onChange={(e) =>
                      setReceivableDueDate(
                        e.target.value
                      )
                    }
                  />

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {

                      const confirmed =
                        window.confirm(
                          "Create receivable?"
                        );

                      if (!confirmed) {
                        return;
                      }

                      createReceivable();

                    }}
                    className="bg-purple-600 text-white py-3 rounded-2xl hover:bg-purple-700 transition-all duration-300"
                  >
                    Add Receivable
                  </motion.button>

                </div>

              )}

              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">

                {receivables.length === 0 ? (

                  <div className="py-10 text-center">

                    <div className="text-4xl mb-3">
                      💳
                    </div>

                    <p className="text-gray-500">
                      No receivables found
                    </p>

                  </div>

                ) : (

                  receivables.map((item: any) => (

                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      key={item.id}
                      className="border border-gray-100 rounded-2xl p-4 flex items-center justify-between bg-white/70 hover:bg-white transition-all duration-200"
                    >

                      <div>

                        <p className="font-semibold text-[#111827]">
                          {item.customerName}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          Due:
                          {" "}
                          {new Date(
                            item.dueDate
                          ).toLocaleDateString()}
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="font-bold text-purple-600 text-lg">
                          ₹{item.amount}
                        </p>

                        <div className="mt-2">

                          {item.status ===
                            "RECEIVED" ? (

                            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                              RECEIVED
                            </span>

                          ) : (

                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              whileHover={{ scale: 1.05 }}
                              onClick={() => {

                                const confirmed =
                                  window.confirm(
                                    "Mark this receivable as received?"
                                  );

                                if (!confirmed) {
                                  return;
                                }

                                markReceived(item.id);
                              }}
                              className="text-sm bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition"
                            >
                              Mark Received
                            </motion.button>

                          )}

                        </div>

                      </div>

                    </motion.div>

                  ))

                )}

              </div>

            </div>

          </div>

          {/* TRANSACTIONS */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300">

            <div className="flex items-center justify-between mb-5">

              <div>

                <h2 className="text-2xl font-bold">
                  Transactions
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Financial transaction records
                </p>

              </div>

              <div className="text-sm text-gray-500">
                Total: {transactions.length}
              </div>

            </div>

            {loading ? (

              <div className="animate-pulse p-6 space-y-4">

                <div className="h-16 bg-slate-200 rounded-2xl"></div>

                <div className="h-16 bg-slate-200 rounded-2xl"></div>

                <div className="h-16 bg-slate-200 rounded-2xl"></div>

                <div className="h-16 bg-slate-200 rounded-2xl"></div>

                <div className="h-16 bg-slate-200 rounded-2xl"></div>

              </div>

            ) : transactions.length === 0 ? (

              <div className="py-14 flex flex-col items-center justify-center text-center">

                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-4xl">
                  💰
                </div>

                <h3 className="text-xl font-semibold text-gray-700">
                  No Transactions Found
                </h3>

                <p className="text-gray-500 mt-2">
                  Start adding transactions to manage finance.
                </p>

              </div>

            ) : (

              <div className="max-h-[500px] overflow-y-auto overflow-x-auto custom-scrollbar pr-2">

                {transactions.map((tx: any) => (

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    key={tx.id}
                    className="min-w-[850px] grid grid-cols-5 py-4 border-b border-gray-100 items-center hover:bg-white px-3 rounded-2xl transition-all duration-200"
                  >

                    <div>

                      <span
                        className={
                          tx.type === "INCOME"
                            ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold"
                            : "bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold"
                        }
                      >
                        {tx.type}
                      </span>

                    </div>

                    <div className="font-semibold">
                      ₹{tx.amount}
                    </div>
                    <div>
                      {new Date(
                        tx.createdAt
                      ).toLocaleDateString()}
                    </div>
                    <div>
                      {tx.account?.name || "-"}
                    </div>

                    <div>

                      {role === "ADMIN" ? (

                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          whileHover={{ scale: 1.05 }}
                          className="text-red-500 hover:text-red-700 font-medium"
                          onClick={() => {

                            const confirmed =
                              window.confirm(
                                "Delete this transaction?"
                              );

                            if (!confirmed) {
                              return;
                            }

                            deleteTransaction(tx.id);
                          }}
                        >
                          Delete
                        </motion.button>

                      ) : (

                        <span className="text-gray-400 text-sm">
                          View Only
                        </span>

                      )}

                    </div>

                  </motion.div>

                ))}

              </div>

            )}

          </div>

        </motion.div>

      </div>

    </AuthGuard>
  );
}