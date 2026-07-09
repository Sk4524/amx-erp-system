"use client";
import FinanceHero from "./components/FinanceHero";
import TransactionTable from "./components/TransactionsTable";
import ExecutiveOverview from "./components/ExecutiveOverview";
import FinanceKPIs from "./components/FinanceKPIs";
import PayablesCard from "./components/PayablesCard";
import FinanceCharts from "./components/FinanceCharts";
import ReceivablesCard from "./components/ReceivablesCard";
import FinancialStatements from "./components/FinancialStatements";
import AIFinanceInsights from "./components/AIFinanceInsights";
import Sidebar from "../../components/Sidebar";
import AuthGuard from "../../components/AuthGuard";
import LedgerTable from "./components/LedgerTable";
import useRole from "../../lib/useRole";

import { useEffect, useState } from "react";

import api from "../../lib/api";

import toast from "react-hot-toast";

import { motion } from "framer-motion";
import FinanceQuickActions from "./components/FinanceQuickActions";
import { exportTransactionsToExcel } from "@/lib/exportExcel";
import { exportTransactionsPDF } from "@/lib/exportPDF";

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

  const [accounts,
    setAccounts] =
    useState<any[]>([]);

  const [vendors,
    setVendors] =
    useState<any[]>([]);

  const [customers,
    setCustomers] =
    useState<any[]>([]);

  const [selectedVendor,
    setSelectedVendor] =
    useState("");

  const [selectedCustomer,
    setSelectedCustomer] =
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

  const [refreshing, setRefreshing] =
    useState(false);
  const [lastUpdated, setLastUpdated] =
    useState(new Date());
  const refreshFinance = async () => {

    try {

      setRefreshing(true);

      await Promise.all([
        fetchTransactions(),
        fetchLedger(),
        fetchAccounts(),
        fetchPayables(),
        fetchReceivables(),
        fetchCustomers(),
        fetchVendors(),
      ]);
      setLastUpdated(new Date());
      toast.success("Finance data refreshed");

    } catch {

      toast.error("Refresh failed");

    } finally {

      setRefreshing(false);

    }

  };

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

  // FETCH ACCOUNTS
  const fetchAccounts = async () => {

    try {

      const res =
        await api.get(
          "/finance/accounts"
        );

      setAccounts(
        res.data.data?.data || []
      );

    } catch (err) {

      console.error(err);

      setAccounts([]);

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


  const fetchVendors = async () => {

    try {

      const res =
        await api.get("/vendors");

      setVendors(
        res.data.data || []
      );

    } catch {

      setVendors([]);

    }

  };

  const fetchCustomers = async () => {

    try {

      const res =
        await api.get("/sales/customers");

      setCustomers(
        res.data.data || []
      );

    } catch {

      setCustomers([]);

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
        fetchAccounts(),
        fetchPayables(),
        fetchReceivables(),
        fetchVendors(),
        fetchCustomers(),
      ]);
      setLastUpdated(new Date());
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
      !selectedVendor ||
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
          vendorName: selectedVendor,
          amount: Number(payableAmount),
          dueDate: payableDueDate,
        }
      );

      setSelectedVendor("");
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
      !selectedCustomer ||
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
          customerName: selectedCustomer,
          amount: Number(receivableAmount),
          dueDate: receivableDueDate,
        }
      );

      setSelectedCustomer("");
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


  const pendingPayables = payables.filter(
    (item: any) => item.status === "PENDING"
  );

  const pendingReceivables = receivables.filter(
    (item: any) => item.status === "PENDING"
  );

  const outstandingPayableAmount = pendingPayables.reduce(
    (sum: number, item: any) => sum + Number(item.amount),
    0
  );

  const outstandingReceivableAmount = pendingReceivables.reduce(
    (sum: number, item: any) => sum + Number(item.amount),
    0
  );
  const handleExportPDF = () => {
    exportTransactionsPDF(transactions);
  };

  const handleExportExcel = () => {
    exportTransactionsToExcel(transactions);
  };

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
          <FinanceHero
            search={search}
            setSearch={setSearch}
            lastUpdated={lastUpdated}
            income={income}
            expense={expense}
            profit={netProfit}

            payables={pendingPayables.length}
            receivables={pendingReceivables.length}

            onRefresh={refreshFinance}
            refreshing={refreshing}

            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
          />


          {/* ANALYTICS */}
          <FinanceKPIs
            income={income}
            expense={expense}
            profit={netProfit}
            accounts={accounts.length}
            payables={pendingPayables.length}
            receivables={pendingReceivables.length}
          />

          <ExecutiveOverview
            income={income}
            expense={expense}
            payables={pendingPayables.length}
            receivables={pendingReceivables.length}
          />
          <AIFinanceInsights
            income={income}
            expense={expense}
            payables={pendingPayables.length}
            receivables={pendingReceivables.length}
          />

          <FinanceCharts
            income={income}
            expense={expense}
            payables={outstandingPayableAmount}
            receivables={outstandingReceivableAmount}
          />
          <div className="grid 2xl:grid-cols-2 gap-7 mb-8">

            <FinancialStatements
              income={income}
              expense={expense}
            />

            <FinanceQuickActions
              role={role}
              amount={amount}
              setAmount={setAmount}
              type={type}
              setType={setType}
              createTransaction={createTransaction}
            />

          </div>

          {/* AP/AR SECTION */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8 items-stretch">

            {/* PAYABLES */}
            <div className="h-full">
              <PayablesCard
                role={role}
                vendors={vendors}
                payables={payables}

                selectedVendor={selectedVendor}
                payableAmount={payableAmount}
                payableDueDate={payableDueDate}

                setSelectedVendor={setSelectedVendor}
                setPayableAmount={setPayableAmount}
                setPayableDueDate={setPayableDueDate}

                createPayable={createPayable}
                markPaid={markPaid}
              />
            </div>


            {/* RECEIVABLES */}
            <div className="h-full">
              <ReceivablesCard
                role={role}
                customers={customers}
                receivables={receivables}

                selectedCustomer={selectedCustomer}
                receivableAmount={receivableAmount}
                receivableDueDate={receivableDueDate}

                setSelectedCustomer={setSelectedCustomer}
                setReceivableAmount={setReceivableAmount}
                setReceivableDueDate={setReceivableDueDate}

                createReceivable={createReceivable}
                markReceived={markReceived}
              />
            </div>
          </div>

          {/* TRANSACTIONS */}
          <TransactionTable
            transactions={transactions}
            loading={loading}
            role={role}
            onDelete={deleteTransaction}
          />
          {/* LEDGER */}
          <LedgerTable
            ledger={ledger}
          />
        </motion.div>

      </div>

    </AuthGuard>
  );
}