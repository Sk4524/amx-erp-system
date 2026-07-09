"use client";

import Sidebar from "../../components/Sidebar";
import AuthGuard from "../../components/AuthGuard";

import { useEffect, useState } from "react";

import api from "../../lib/api";

import toast from "react-hot-toast";

import { motion } from "framer-motion";

import {
  Users,
  ShoppingCart,
  IndianRupee,
  Package,
} from "lucide-react";

export default function SalesPage() {

  const [customers,
    setCustomers] =
    useState<any[]>([]);

  const [orders,
    setOrders] =
    useState<any[]>([]);

  const [inventory,
    setInventory] =
    useState<any[]>([]);

  const [loading,
    setLoading] =
    useState(true);

  const [creatingCustomer,
    setCreatingCustomer] =
    useState(false);

  const [creatingOrder,
    setCreatingOrder] =
    useState(false);

  const [role, setRole] =
    useState("");

  // CUSTOMER STATES
  const [customerName,
    setCustomerName] =
    useState("");

  const [customerEmail,
    setCustomerEmail] =
    useState("");

  const [customerPhone,
    setCustomerPhone] =
    useState("");

  const [customerAddress,
    setCustomerAddress] =
    useState("");

  // ORDER STATES
  const [selectedCustomer,
    setSelectedCustomer] =
    useState("");

  const [productName,
    setProductName] =
    useState("");

  const [quantity,
    setQuantity] =
    useState("");

  const [price,
    setPrice] =
    useState("");

  // LOAD ROLE
  useEffect(() => {

    const savedRole =
      localStorage.getItem("role");

    if (savedRole) {

      setRole(savedRole);
    }

  }, []);

  // FETCH CUSTOMERS
  const fetchCustomers =
    async () => {

      try {

        const res =
          await api.get(
            "/sales/customers"
          );

        setCustomers(

  Array.isArray(res.data)

    ? res.data

    : Array.isArray(res.data.data)

    ? res.data.data

    : []

);

      } catch (err) {

        console.log(err);

        setCustomers([]);
      }
    };

  // FETCH ORDERS
  const fetchOrders =
    async () => {

      try {

        const res =
          await api.get(
            "/sales/orders"
          );

        setOrders(

  Array.isArray(res.data)

    ? res.data

    : Array.isArray(res.data.data)

    ? res.data.data

    : []

);

      } catch (err) {

        console.log(err);

        setOrders([]);
      }
    };

  // FETCH INVENTORY
 const fetchInventory = async () => {

  try {

    const res = await api.get("/inventory");

    const inventoryData =
      Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];

    setInventory(inventoryData);

  } catch (err) {

    console.log(err);

    setInventory([]);

  }

};

  // INITIAL LOAD
  useEffect(() => {
    if (!role) return;

    const loadData = async () => {

      setLoading(true);

      try {

        if (
          role === "ADMIN" ||
          role === "SALES"
        ) {

          await Promise.all([
            fetchCustomers(),
            fetchOrders(),
            fetchInventory(),
          ]);

        } else {

          await Promise.all([
            fetchCustomers(),
            fetchOrders(),
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();

  }, [role]);

  // CREATE CUSTOMER
  const createCustomer =
    async () => {
      if (!customerName.trim()) {

        return toast.error(
          "Customer name is required"
        );

      }
      if (
        customerEmail &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          customerEmail
        )
      ) {

        return toast.error(
          "Invalid Email Address"
        );

      }
      if (
        customerPhone &&
        !/^\d{10}$/.test(customerPhone)
      ) {

        return toast.error(
          "Invalid Phone Number"
        );

      }

      try {
        setCreatingCustomer(true);

        await api.post(
          "/sales/customers",
          {
            name:
              customerName,

            email:
              customerEmail,

            phone:
              customerPhone,

            address:
              customerAddress,
          }
        );

        setCustomerName("");
        setCustomerEmail("");
        setCustomerPhone("");
        setCustomerAddress("");

        fetchCustomers();

        toast.success(
          "Customer Added ✅"
        );

      } catch (err) {

        console.log(err);

        toast.error(
          "Customer Create Failed"
        );
      }
      finally {

        setCreatingCustomer(false);

      }
    };

  // CREATE SALES ORDER
  const createOrder =
    async () => {
      if (
        !selectedCustomer ||
        !productName ||
        Number(quantity) <= 0 ||
        Number(price) <= 0
      ) {

        return toast.error(
          "Please fill all order details"
        );

      }

      const selectedInventory =
        inventory.find(
          (i: any) =>
            i.productName ===
            productName
        );

      if (
        selectedInventory &&
        Number(quantity) >
        selectedInventory.quantity
      ) {

        return toast.error(
          "Quantity exceeds available stock"
        );

      }

      try {
        setCreatingOrder(true);

        await api.post(
          "/sales/orders",
          {
            customerId:
              selectedCustomer,

            productName,

            quantity:
              Number(quantity),

            price:
              Number(price),
          }
        );

        setSelectedCustomer("");
        setProductName("");
        setQuantity("");
        setPrice("");

        await Promise.all([
          fetchOrders(),
          fetchInventory(),
          fetchCustomers(),
        ]);

        toast.success(
          "Sales Order Created ✅"
        );

      } catch (err: any) {

        console.log(err);

        toast.error(
          err?.response?.data
            ?.message ||
          "Sales Order Failed"
        );
      }
      finally {

        setCreatingOrder(false);

      }
    };

  // TOTAL SALES
  const totalSales =
    orders.reduce(
      (
        acc: number,
        curr: any
      ) =>

        acc +

        Number(

          curr.totalAmount ??

          (
            Number(curr.price || 0)
            *
            Number(curr.quantity || 0)
          )

        ),

      0
    );

  if (
    role &&
    role !== "ADMIN" &&
    role !== "SALES"
  ) {

    return (

      <AuthGuard>

        <div className="flex">

          <Sidebar />

          <div className="ml-72 min-h-screen flex items-center justify-center w-full">

            <div className="bg-white p-10 rounded-3xl shadow-xl text-center">

              <h2 className="text-3xl font-bold text-red-600">

                Access Denied

              </h2>

              <p className="mt-4 text-gray-500">

                You do not have permission
                to access Sales Module.

              </p>

            </div>

          </div>

        </div>

      </AuthGuard>

    );
  }

  if (loading) {

    return (

      <AuthGuard>

        <div className="flex">

          <Sidebar />

          <div className="ml-[290px] flex items-center justify-center min-h-screen w-full">

            <div className="text-center">

              <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

              <p className="text-gray-600 font-medium">

                Loading Sales Dashboard...

              </p>

            </div>

          </div>

        </div>

      </AuthGuard>

    );

  }

  return (

    <AuthGuard>

      <div className="flex bg-gradient-to-br from-[#eef2f7] to-[#e5ebf3] min-h-screen">

        <Sidebar />

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
          }}
          className="p-8 w-full ml-72 text-black"
        >

          {/* HEADER */}
          <div className="relative overflow-hidden bg-white/75 backdrop-blur-2xl border border-white/50 shadow-[0_20px_70px_rgba(0,0,0,0.08)] rounded-[36px] p-6 xl:p-7 mb-10">

            {/* PREMIUM OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-rose-50/30 pointer-events-none"></div>

            {/* GLOW EFFECTS */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-rose-400/20 rounded-full blur-3xl"></div>

            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl"></div>

            {/* TOP BORDER */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500"></div>

            {/* CONTENT */}
            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

              {/* LEFT */}
              <div className="flex-1 max-w-3xl">

                {/* TITLE */}
                <div className="flex items-start gap-4">

                  {/* ICON */}
                  <div className="relative">

                    <div className="absolute inset-0 bg-rose-500/30 blur-2xl rounded-full"></div>

                    <div className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500 text-white p-4 rounded-[28px] shadow-[0_15px_35px_rgba(244,63,94,0.35)] border border-white/20">

                      🛒

                    </div>

                  </div>

                  {/* TEXT */}
                  <div>

                    <p className="text-sm uppercase tracking-[0.30em] text-rose-600 font-bold">

                      Enterprise ERP

                    </p>

                    <h1 className="text-4xl sm:text-5xl xl:text-[56px] font-black text-[#0f172a] tracking-tight leading-[0.95] mt-2">

                      Sales
                      <br />
                      & CRM

                    </h1>

                    {/* TAGS */}
                    <div className="flex flex-wrap items-center gap-3 mt-4">

                      <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">

                        CUSTOMER MANAGEMENT

                      </div>

                      <div className="bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">

                        SALES PIPELINE

                      </div>

                      <div className="bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide hidden sm:flex">

                        CRM ANALYTICS

                      </div>

                    </div>

                  </div>

                </div>

                {/* DESCRIPTION */}
                <p className="text-gray-600 text-[17px] leading-relaxed max-w-2xl mt-6">

                  Manage customer relationships, monitor sales
                  pipelines, track business opportunities and
                  streamline enterprise CRM operations efficiently.

                </p>

                {/* STATUS */}
                <div className="flex flex-wrap items-center gap-3 mt-6">

                  {/* ACTIVE */}
                  <div className="flex items-center gap-2 bg-emerald-100/80 backdrop-blur-xl text-emerald-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-emerald-200 shadow-sm">

                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>

                    CRM Systems Active

                  </div>

                  {/* SALES */}
                  <div className="bg-rose-100/80 backdrop-blur-xl text-rose-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-rose-200 shadow-sm">

                    Live Sales Tracking

                  </div>

                  {/* ANALYTICS */}
                  <div className="bg-fuchsia-100/80 backdrop-blur-xl text-fuchsia-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-fuchsia-200 shadow-sm">

                    AI Sales Insights Enabled

                  </div>

                </div>

              </div>

              {/* RIGHT */}
              <div className="hidden xl:flex items-center justify-center">

                <div className="relative">

                  <div className="absolute inset-0 bg-rose-400/20 blur-3xl rounded-full"></div>

                  <div className="relative w-52 h-52 rounded-full bg-gradient-to-br from-rose-500/10 via-pink-500/10 to-fuchsia-500/10 border border-white/30 backdrop-blur-2xl flex items-center justify-center">

                    <div className="text-[80px]">

                      🛒

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ANALYTICS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

            {[
              {
                title: "Customers",
                value: customers.length,
                icon: <Users size={28} />,
                gradient:
                  "from-blue-500 to-cyan-400",
              },
              {
                title: "Sales Orders",
                value: orders.length,
                icon:
                  <ShoppingCart size={28} />,
                gradient:
                  "from-purple-600 to-pink-500",
              },
              {
                title: "Total Revenue",
                value: `₹${totalSales.toLocaleString()}`,
                icon:
                  <IndianRupee size={28} />,
                gradient:
                  "from-green-500 to-emerald-400",
              },
              {
                title: "Inventory Items",
                value:
                  role === "ADMIN" ||
                    role === "SALES"
                    ? inventory.length
                    : "N/A",
                icon:
                  <Package size={28} />,
                gradient:
                  "from-orange-500 to-red-400",
              },
            ].map((card, index) => (

              <motion.div
                key={index}
                whileHover={{
                  y: -5,
                  scale: 1.02,
                }}
                className={`relative overflow-hidden bg-gradient-to-br ${card.gradient} text-white rounded-3xl p-5 shadow-lg`}
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-white/80">
                      {card.title}
                    </p>

                    <h2 className="text-4xl font-bold mt-3 break-words">
                      {card.value}
                    </h2>

                  </div>

                  <div className="bg-white/20 p-3 rounded-2xl">
                    {card.icon}
                  </div>

                </div>

              </motion.div>

            ))}

          </div>

          {/* FORMS */}
          {(
            role === "ADMIN" ||
            role === "SALES"
          ) && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">

                {/* CUSTOMER */}
                <motion.div
                  whileHover={{
                    y: -3,
                  }}
                  className="bg-white/70 backdrop-blur-xl rounded-3xl relative overflow-hidden p-6 shadow-xl border border-white/40"
                >

                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>

                  <div className="mb-6">

                    <h2 className="text-3xl font-bold text-[#111827]">
                      Add Customer
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Create and manage customer profiles
                    </p>

                  </div>

                  <div className="grid gap-4">

                    <input
                      placeholder="Customer Name"
                      className="p-3 border border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={customerName}
                      onChange={(e) =>
                        setCustomerName(
                          e.target.value
                        )
                      }
                    />

                    <input
                      placeholder="Email"
                      className="p-3 border border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={customerEmail}
                      onChange={(e) =>
                        setCustomerEmail(
                          e.target.value
                        )
                      }
                    />

                    <input
                      placeholder="Phone"
                      className="p-3 border border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={customerPhone}
                      onChange={(e) =>
                        setCustomerPhone(
                          e.target.value
                        )
                      }
                    />

                    <input
                      placeholder="Address"
                      className="p-3 border border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={customerAddress}
                      onChange={(e) =>
                        setCustomerAddress(
                          e.target.value
                        )
                      }
                    />

                    <motion.button
                      disabled={creatingCustomer}
                      whileTap={{
                        scale: 0.96,
                      }}
                      whileHover={{
                        scale: 1.01,
                      }}
                      onClick={
                        createCustomer
                      }
                      className="bg-blue-600 text-white py-3 rounded-2xl hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-xl"
                    >
                      {
                        creatingCustomer
                          ? "Adding..."
                          : "Add Customer"
                      }
                    </motion.button>

                  </div>

                </motion.div>

                {/* SALES ORDER */}
                <motion.div
                  whileHover={{
                    y: -3,
                  }}
                  className="bg-white/70 backdrop-blur-xl rounded-3xl relative overflow-hidden p-6 shadow-xl border border-white/40"
                >

                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400"></div>

                  <div className="mb-6">

                    <h2 className="text-3xl font-bold text-[#111827]">
                      Create Sales Order
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Generate customer sales orders
                    </p>

                  </div>

                  <div className="grid gap-4">

                    <select
                      className="border border-gray-200 p-3 rounded-2xl bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                      value={
                        selectedCustomer
                      }
                      onChange={(e) => {

                        setSelectedCustomer(
                          e.target.value
                        );

                      }}
                    >

                      <option value="">
                        {
                          customers.length === 0
                            ? "No Customers Found"
                            : "Select Customer"
                        }
                      </option>

                      {customers.map(
                        (c: any) => (

                          <option
                            key={c.id}
                            value={c.id}
                          >
                            {c.name}
                          </option>

                        ))}

                    </select>

                    <select
                      className="border border-gray-200 p-3 rounded-2xl bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                      value={productName}
                      onChange={(e) => {

                        const selected =
                          inventory.find(
                            (i: any) =>
                              i.productName ===
                              e.target.value
                          );

                        setProductName(
                          e.target.value
                        );

                        if (selected?.price) {

                          setPrice(
                            String(selected.price)
                          );

                        }

                      }}
                    >

                      <option value="">
                        Select Product
                      </option>

                      {inventory.map(
                        (i: any) => (

                          <option
                            key={i.id}
                            value={
                              i.productName
                            }
                          >

                            {i.productName}
                            {" "}
                            (
                            {i.quantity}
                            )

                          </option>

                        ))}

                    </select>

                    <input
                      type="number"
                      placeholder="Quantity"
                      className="border border-gray-200 p-3 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          e.target.value
                        )
                      }
                    />

                    <input
                      type="number"
                      placeholder="Price"
                      className="border border-gray-200 p-3 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                      value={price}
                      onChange={(e) =>
                        setPrice(
                          e.target.value
                        )
                      }
                    />

                    <motion.button
                      disabled={creatingOrder}
                      whileTap={{
                        scale: 0.96,
                      }}
                      whileHover={{
                        scale: 1.01,
                      }}
                      onClick={
                        createOrder
                      }
                      className="bg-green-600 text-white py-3 rounded-2xl hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-xl"
                    >
                      {
                        creatingOrder
                          ? "Creating..."
                          : "Create Sales Order"
                      }
                    </motion.button>

                  </div>

                </motion.div>

              </div>
            )}

          {/* SALES ORDERS */}
          <motion.div
            whileHover={{
              y: -2,
            }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl relative overflow-hidden p-6 shadow-xl border border-white/40"
          >

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-pink-500"></div>

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-3xl font-bold text-[#111827]">
                  Sales Orders
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Customer sales and completed orders
                </p>

              </div>

              <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                {orders.length} orders
              </span>

            </div>

            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">

              {loading ? (

                <div className="py-20 text-center text-gray-500">
                  Loading sales orders...
                </div>

              ) : orders.length === 0 ? (

                <div className="flex flex-col items-center justify-center py-20 text-gray-500">

                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-4xl">
                    🛒
                  </div>

                  <p className="text-xl font-semibold">
                    No Sales Orders Found
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    Create your first sales order
                  </p>

                </div>

              ) : (

                orders.map((item: any) => (

                  <motion.div
                    whileHover={{
                      scale: 1.01,
                    }}
                    key={item.id}
                    className="border border-gray-200 rounded-2xl p-5 flex items-center justify-between hover:shadow-md hover:border-purple-300 transition-all duration-300 bg-white/80"
                  >

                    <div>

                      <p className="font-bold text-lg text-[#111827]">
                        {item.productName}
                      </p>

                      <p className="text-gray-500 text-sm mt-1">

                        Customer:
                        {" "}
                        {item.customer?.name}

                      </p>

                      <p className="text-sm text-gray-500 mt-1">

                        Date:
                        {" "}
                        {item.createdAt?.slice(0, 10)}

                      </p>

                    </div>

                    <div className="text-right">

                      <p className="font-bold text-green-600 text-2xl">
                        ₹{
                          item.totalAmount ??
                          (
                            Number(item.price || 0)
                            *
                            Number(item.quantity || 0)
                          )
                        }
                      </p>

                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold inline-block mt-3">
                        COMPLETED
                      </span>

                    </div>

                  </motion.div>

                ))
              )}

            </div>

          </motion.div>

        </motion.div>

      </div>

    </AuthGuard>
  );
}