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
import socket from "../../lib/socket";
import {
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import FinanceSkeleton from "./components/FinanceSkeleton";
import api from "../../lib/api";
import FinanceActivity from "./components/FinanceActivity";
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
  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");
  const [transactionType, setTransactionType] =
    useState("");
  const [minAmount, setMinAmount] =
    useState("");

  const [maxAmount, setMaxAmount] =
    useState("");

  const [sortBy, setSortBy] =
    useState("latest");
  const [analytics, setAnalytics] = useState({
    income: 0,
    expense: 0,
    profit: 0,
    transactionCount: 0,
    outstandingPayables: 0,
    outstandingReceivables: 0,
    totalPayables: 0,
    totalReceivables: 0,
  });


  const [monthlyAnalytics, setMonthlyAnalytics] =
    useState<
      {
        month: string;
        income: number;
        expense: number;
      }[]
    >([]);

  const [financeKPIs, setFinanceKPIs] = useState({
    accountBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    netProfit: 0,
    pendingPayables: 0,
    pendingReceivables: 0,
  });

  const [trialBalance, setTrialBalance] =
    useState<any[]>([]);

  const [profitLoss, setProfitLoss] =
    useState<any>(null);

  const [balanceSheet, setBalanceSheet] =
    useState<any>(null);

  const [cashFlow, setCashFlow] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);
  const [lastUpdated, setLastUpdated] =
    useState(new Date());
  const isMounted = useRef(true);

  const refreshTimeout = useRef<NodeJS.Timeout | null>(null);


  // LOAD ROLE
 const {
  role,
  loading: roleLoading,
} = useRole();
  // FETCH TRANSACTIONS
  const fetchTransactions = useCallback(async () => {

    try {

      const params = new URLSearchParams();

      if (search) {
        params.append("search", search);
      }

      if (fromDate) {
        params.append("fromDate", fromDate);
      }

      if (toDate) {
        params.append("toDate", toDate);
      }
      if (transactionType) {
        params.append("type", transactionType);
      }


      if (minAmount) {
        params.append("minAmount", minAmount);
      }

      if (maxAmount) {
        params.append("maxAmount", maxAmount);
      }

      if (sortBy) {
        params.append("sortBy", sortBy);
      }
      const res = await api.get(
        `/finance/transactions?${params.toString()}`
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
  }, [
    search,
    fromDate,
    toDate,
    transactionType,
    minAmount,
    maxAmount,
    sortBy,
  ]);

  const fetchAnalytics = useCallback(async () => {

    try {

      const res = await api.get("/finance/analytics");

      setAnalytics(res.data.data);

    } catch (err) {

      console.error(err);

    }

  }, []);

  const fetchMonthlyAnalytics = useCallback(async () => {

    try {

      const res =
        await api.get("/finance/monthly-analytics");

      setMonthlyAnalytics(
        res.data.data || []
      );

    } catch (err) {

      console.error(err);

      setMonthlyAnalytics([]);

    }

  }, []);

  const fetchFinanceKPIs = useCallback(async () => {

    try {

      const res =
        await api.get("/finance/kpis");

      setFinanceKPIs(
        res.data.data,
      );

    } catch (err) {

      console.error(err);

    }

  }, []);

  const fetchFinancialReports = useCallback(async () => {

    try {

      const [
        trial,
        profit,
        balance,
        cash,
      ] = await Promise.all([
        api.get("/finance/trial-balance"),
        api.get("/finance/profit-loss"),
        api.get("/finance/balance-sheet"),
        api.get("/finance/cash-flow"),
      ]);

      setTrialBalance(trial.data.data);
      setProfitLoss(profit.data.data);
      setBalanceSheet(balance.data.data);
      setCashFlow(cash.data.data);

    } catch (err) {

      console.error(err);

    }

  }, []);

  // FETCH LEDGER
  const fetchLedger = useCallback(async () => {

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

      setLedger([]);

      toast.error(
        "Failed to load ledger"
      );
    }
  }, []);


  const fetchVendors = useCallback(async () => {

    try {

      const res =
        await api.get("/vendors");

      setVendors(
        res.data.data || []
      );

    } catch {

      setVendors([]);

    }

  }, []);

  const fetchCustomers = useCallback(async () => {

    try {

      const res =
        await api.get("/sales/customers");

      setCustomers(
        res.data.data || []
      );

    } catch {

      setCustomers([]);

    }

  }, []);

  // FETCH PAYABLES
  const fetchPayables = useCallback(async () => {

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

      setPayables([]);

      toast.error(
        "Failed to load payables"
      );
    }
  }, []);

  // FETCH RECEIVABLES
  const fetchReceivables = useCallback(async () => {

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

      setReceivables([]);

      toast.error(
        "Failed to load receivables"
      );
    }
  }, []);


  const refreshFinance = useCallback(async () => {

    if (refreshing) {
      return;
    }

    try {

      setRefreshing(true);

      await Promise.all([
        fetchTransactions(),
        fetchLedger(),
        fetchAnalytics(),
        fetchMonthlyAnalytics(),
        fetchFinanceKPIs(),
        fetchFinancialReports(),
        fetchPayables(),
        fetchReceivables(),
        fetchCustomers(),
        fetchVendors(),
      ]);
      if (isMounted.current) {

        setLastUpdated(new Date());

        if (!refreshing) {

          toast.success("Finance updated");

        }

      }

    } catch {

      toast.error("Refresh failed");

    } finally {

      if (isMounted.current) {

        setRefreshing(false);

      }

    }

  }, [
    refreshing,
    fetchTransactions,
    fetchLedger,
    fetchAnalytics,
    fetchMonthlyAnalytics,
    fetchFinanceKPIs,
    fetchFinancialReports,
    fetchPayables,
    fetchReceivables,
    fetchCustomers,
    fetchVendors,
  ]);

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
        fetchAnalytics(),
        fetchMonthlyAnalytics(),
        fetchFinanceKPIs(),
        fetchFinancialReports(),
        fetchLedger(),
        fetchPayables(),
        fetchReceivables(),
        fetchVendors(),
        fetchCustomers(),
      ]);

      if (isMounted.current) {

        setLastUpdated(new Date());

        setLoading(false);

      }

    };

    loadData();

  },

    [
      role,
      fetchTransactions,
      fetchAnalytics,
      fetchMonthlyAnalytics,
      fetchFinanceKPIs,
      fetchFinancialReports,
      fetchLedger,
      fetchPayables,
      fetchReceivables,
      fetchVendors,
      fetchCustomers,
    ]

  );

  useEffect(() => {

    const scheduleRefresh = () => {

      if (refreshTimeout.current) {

        clearTimeout(refreshTimeout.current);

      }

      refreshTimeout.current = setTimeout(() => {

        refreshFinance();

      }, 300);

    };

    socket.on("finance-updated", scheduleRefresh);

    socket.on("dashboard-refresh", scheduleRefresh);

    socket.on("notification", scheduleRefresh);

    return () => {

      isMounted.current = false;

      if (refreshTimeout.current) {

        clearTimeout(refreshTimeout.current);

      }

      socket.off("finance-updated", scheduleRefresh);

      socket.off("dashboard-refresh", scheduleRefresh);

      socket.off("notification", scheduleRefresh);

    };

  }, [refreshFinance]);

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
        fetchAnalytics(),
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
        fetchAnalytics(),
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
        fetchAnalytics(),
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
        fetchAnalytics(),
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
        fetchAnalytics(),
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
        fetchAnalytics(),
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
  const pendingPayables = payables.filter(
    (item: any) => item.status === "PENDING"
  );

  const pendingReceivables = receivables.filter(
    (item: any) => item.status === "PENDING"
  );

  const handleExportPDF = () => {
    exportTransactionsPDF(transactions);
  };

  const handleExportExcel = () => {
    exportTransactionsToExcel(transactions);
  };

 if (roleLoading) {

  return (

    <AuthGuard>

      <div className="flex">

        <Sidebar />

        <div className="ml-[290px] w-full px-6 xl:px-8 py-7 bg-gradient-to-br from-[#eef2f7] to-[#e5ebf3] min-h-screen">

          <FinanceSkeleton />

        </div>

      </div>

    </AuthGuard>

  );

}

if (!role) {

  return null;

}
  if (loading) {

    return (

      <AuthGuard>

        <div className="flex">

          <Sidebar />

          <div className="ml-[290px] w-full px-6 xl:px-8 py-7 bg-gradient-to-br from-[#eef2f7] to-[#e5ebf3] min-h-screen">

            <FinanceSkeleton />

          </div>

        </div>

      </AuthGuard>

    );

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

            fromDate={fromDate}
            toDate={toDate}

            setFromDate={setFromDate}
            setToDate={setToDate}

            lastUpdated={lastUpdated}

            income={analytics.income}
            expense={analytics.expense}
            profit={analytics.profit}

            payables={pendingPayables.length}
            receivables={pendingReceivables.length}

            onSearch={fetchTransactions}

            onRefresh={refreshFinance}
            refreshing={refreshing}

            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}

            transactionType={transactionType}
            setTransactionType={setTransactionType}

            minAmount={minAmount}
            maxAmount={maxAmount}

            setMinAmount={setMinAmount}
            setMaxAmount={setMaxAmount}

            sortBy={sortBy}
            setSortBy={setSortBy}
            onResetFilters={() => {

              setSearch("");
              setFromDate("");
              setToDate("");

              setTransactionType("");

              setMinAmount("");
              setMaxAmount("");

              setSortBy("latest");

              fetchTransactions();

            }}
          />

          {/* ANALYTICS */}
          <div className="mb-10">
            <FinanceKPIs
              income={financeKPIs.totalIncome}
              expense={financeKPIs.totalExpense}
              profit={financeKPIs.netProfit}
              cashBalance={financeKPIs.accountBalance}
              
              payables={financeKPIs.pendingPayables}
              receivables={financeKPIs.pendingReceivables}
            />
          </div>
          <div className="mb-10">
            <ExecutiveOverview
              income={analytics.income}
              expense={analytics.expense}
              payables={pendingPayables.length}
              receivables={pendingReceivables.length}
            />
          </div>

          <div className="mb-10">
            <AIFinanceInsights
              income={analytics.income}
              expense={analytics.expense}
              payables={pendingPayables.length}
              receivables={pendingReceivables.length}
            />
          </div>

          <div className="mb-10">
            <FinanceCharts
              income={analytics.income}
              expense={analytics.expense}
              payables={analytics.outstandingPayables}
              receivables={analytics.outstandingReceivables}
              monthlyAnalytics={monthlyAnalytics}
            />
          </div>

          <div className="grid grid-cols-1 2xl:grid-cols-12 gap-8 mb-12 items-start">

            <div className="2xl:col-span-8">

              <FinancialStatements
                income={financeKPIs.totalIncome}
                expense={financeKPIs.totalExpense}

                trialBalance={trialBalance}

                profitLoss={profitLoss}

                balanceSheet={balanceSheet}

                cashFlow={cashFlow}
              />

            </div>
            <div className="2xl:col-span-4">
              <FinanceActivity
                transactions={transactions}
              />
            </div>
          </div>

          <div className="mb-12">

            <FinanceQuickActions
              role={role}
              amount={amount}
              setAmount={setAmount}
              type={type}
              setType={setType}
              createTransaction={createTransaction}
            />

          </div>

          {/* ================================
      ACCOUNTS PAYABLE & RECEIVABLE
================================ */}

          <div className="mb-8">

            <div className="rounded-[34px] border border-white/50 bg-white/80 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,.06)] p-8">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                <div>

                  <p className="uppercase tracking-[0.30em] text-xs font-bold text-slate-500">

                    WORKING CAPITAL

                  </p>

                  <h2 className="mt-2 text-[38px] font-black text-slate-900">

                    Accounts Payable & Receivable

                  </h2>

                  <p className="mt-3 max-w-3xl text-slate-500 leading-7">

                    Manage vendor obligations and customer collections from a unified
                    enterprise workspace with real-time financial visibility.

                  </p>

                </div>

                <div className="flex gap-4">

                  <div className="rounded-3xl bg-orange-100 px-6 py-5">

                    <p className="text-xs font-semibold text-orange-600">

                      PAYABLES

                    </p>

                    <h3 className="mt-2 text-3xl font-black text-orange-600">

                      {pendingPayables.length}

                    </h3>

                  </div>

                  <div className="rounded-3xl bg-blue-100 px-6 py-5">

                    <p className="text-xs font-semibold text-blue-600">

                      RECEIVABLES

                    </p>

                    <h3 className="mt-2 text-3xl font-black text-blue-600">

                      {pendingReceivables.length}

                    </h3>

                  </div>

                </div>

              </div>

            </div>

          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12 items-start">

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
          <div className="mb-12">
            <TransactionTable
              transactions={transactions}
              loading={loading}
              role={role}
              onDelete={deleteTransaction}
            />
          </div>
          {/* LEDGER */}
          <LedgerTable
            ledger={ledger}
          />
        </motion.div>

      </div>

    </AuthGuard>
  );
}