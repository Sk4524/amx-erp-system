"use client";

import Sidebar from "../../components/Sidebar";
import AuthGuard from "../../components/AuthGuard";

import { useEffect, useState } from "react";

import api from "../../lib/api";

import toast from "react-hot-toast";

import { motion } from "framer-motion";

import {
  Package,
  AlertTriangle,
  ShoppingCart,
  ArrowUpDown,
} from "lucide-react";

export default function InventoryPage() {

  const [items, setItems] =
    useState<any[]>([]);

  const [purchaseOrders,
    setPurchaseOrders] =
    useState<any[]>([]);

  const [stockMovements,
    setStockMovements] =
    useState<any[]>([]);

  const [productName,
    setProductName] =
    useState("");

  const [sku, setSku] =
    useState("");

  const [quantity,
    setQuantity] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [category,
    setCategory] =
    useState("");

  const [editingId,
    setEditingId] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [role, setRole] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  // PURCHASE ORDER STATES
  const [vendorName,
    setVendorName] =
    useState("");

  const [poProductName,
    setPoProductName] =
    useState("");

  const [poQuantity,
    setPoQuantity] =
    useState("");

  const [poPrice,
    setPoPrice] =
    useState("");

  // LOAD ROLE
  useEffect(() => {

    const savedRole =
      localStorage.getItem("role");

    if (savedRole) {

      setRole(savedRole);
    }

  }, []);

  // FETCH INVENTORY
  const fetchInventory =
    async () => {

      try {

        const res = await api.get(
  `/inventory?search=${search}`
);

setItems(
  res.data.data.data || []
);

      } catch (err: any) {

        console.error(err);

        setItems([]);

        toast.error(
          "Failed to load inventory"
        );
      }
    };

  // FETCH PURCHASE ORDERS
  const fetchPurchaseOrders =
    async () => {

      try {

        const res =
          await api.get(
            "/inventory/purchase-orders"
          );

   setPurchaseOrders(
  res.data.data.data || []
);
      } catch (err: any) {

        console.error(err);

        setItems([]);

        toast.error(
          "Failed to load PurchaseOrder"
        );
      }
    };

  // FETCH STOCK MOVEMENTS
  const fetchStockMovements =
    async () => {

      try {

        const res =
          await api.get(
            "/inventory/stock-movements"
          );

    setStockMovements(
  res.data.data.data || []
);

      } catch (err: any) {

        console.error(err);

        setItems([]);

        toast.error(
          "Failed to load stock-movement"
        );
      }
    };

  // INITIAL LOAD
  useEffect(() => {

    if (!role) {
      return;
    }

    const loadData = async () => {

      setLoading(true);

      const requests = [
        fetchInventory(),
      ];

      if (
        role === "ADMIN" ||
        role === "MANAGER"
      ) {
        requests.push(
          fetchPurchaseOrders()
        );
      }

      if (
        role === "ADMIN" ||
        role === "MANAGER" ||
        role === "FINANCE"
      ) {
        requests.push(
          fetchStockMovements()
        );
      }

      await Promise.all(requests);

      setLoading(false);
    };

    loadData();

  }, [search, role]);

  // CREATE INVENTORY SKU
  const addProduct =
    async () => {

      if (
        !productName.trim() ||
        !sku.trim() ||
        !quantity ||
        !price ||
        !category.trim()
      ) {

        toast.error(
          "All fields are required"
        );

        return;
      }

      try {

        await api.post(
          "/inventory",
          {
            productName,
            sku,
            quantity:
              Number(quantity),
            price:
              Number(price),
            category,
          }
        );

        setProductName("");
        setSku("");
        setQuantity("");
        setPrice("");
        setCategory("");

        fetchInventory();

        toast.success(
          "Inventory SKU Created ✅"
        );

      } catch (err: any) {

        toast.error(
          "Create SKU Failed"
        );
      }
    };

  // UPDATE PRODUCT
  const updateProduct =
    async () => {

      try {

        await api.put(
          `/inventory/${editingId}`,
          {
            productName,
            sku,
            quantity:
              Number(quantity),
            price:
              Number(price),
            category,
          }
        );

        setEditingId("");

        setProductName("");
        setSku("");
        setQuantity("");
        setPrice("");
        setCategory("");

        fetchInventory();

        toast.success(
          "Inventory Updated ✅"
        );

      } catch (err: any) {

        toast.error(
          "Update Failed"
        );
      }
    };

  // DELETE PRODUCT
  const deleteProduct =
    async (id: string) => {

      try {

        await api.delete(
          `/inventory/${id}`
        );

        fetchInventory();

        toast.success(
          "Product Deleted ✅"
        );

      } catch (err: any) {

        toast.error(
          err?.response?.data?.message ||
          "Delete Failed"
        );
      }
    };

  // CREATE PURCHASE ORDER
  const createPurchaseOrder =
    async () => {

      if (
        !vendorName.trim() ||
        !poProductName ||
        !poQuantity ||
        !poPrice
      ) {

        toast.error(
          "All fields are required"
        );

        return;
      }

      try {

        await api.post(
          "/inventory/purchase-orders",
          {
            vendorName,

            productName:
              poProductName,

            quantity:
              Number(poQuantity),

            price:
              Number(poPrice),
          }
        );

        setVendorName("");

        setPoProductName("");

        setPoQuantity("");

        setPoPrice("");

        fetchPurchaseOrders();

        toast.success(
          "Purchase Order Created ✅"
        );

      } catch (err) {

        toast.error(
          "Failed"
        );
      }
    };

  // COMPLETE PURCHASE ORDER
  const completePurchaseOrder =
    async (id: string) => {

      try {

        await api.post(
          `/inventory/purchase-orders/${id}/complete`
        );

        fetchPurchaseOrders();

        fetchInventory();

        fetchStockMovements();

        toast.success(
          "Inventory Stock Updated ✅"
        );

      } catch (err) {

      }
    };
  const lowStockCount =
    items.filter(
      (i: any) =>
        i.quantity <= 5
    ).length;

  const pendingOrdersCount =
    purchaseOrders.filter(
      (p: any) =>
        p.status === "PENDING"
    ).length;
  return (

    <AuthGuard>

      <div className="flex bg-gradient-to-br from-[#eef2f7] to-[#e5ebf3] min-h-screen overflow-x-hidden">

        <Sidebar />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-8 flex-1 ml-[290px] text-black overflow-x-hidden"
        >

          {/* HEADER */}
          <div className="relative overflow-hidden bg-white/75 backdrop-blur-2xl border border-white/50 shadow-[0_20px_70px_rgba(0,0,0,0.08)] rounded-[36px] p-6 xl:p-7 mb-10">

            {/* PREMIUM OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-amber-50/30 pointer-events-none"></div>

            {/* GLOW EFFECTS */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl"></div>

            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-orange-400/20 rounded-full blur-3xl"></div>

            {/* TOP BORDER */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500"></div>

            {/* CONTENT */}
            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

              {/* LEFT */}
              <div className="flex-1 max-w-3xl">

                {/* TITLE ROW */}
                <div className="flex items-start gap-4">

                  {/* ICON */}
                  <div className="relative">

                    <div className="absolute inset-0 bg-amber-500/30 blur-2xl rounded-full"></div>

                    <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 text-white p-4 rounded-[28px] shadow-[0_15px_35px_rgba(245,158,11,0.35)] border border-white/20">

                      📦

                    </div>

                  </div>

                  {/* TEXT */}
                  <div>

                    <p className="text-sm uppercase tracking-[0.30em] text-amber-600 font-bold">

                      Enterprise ERP

                    </p>

                    <h1 className="text-4xl sm:text-5xl xl:text-[56px] font-black text-[#0f172a] tracking-tight leading-[0.95] mt-2">

                      Inventory
                      <br />
                      Management

                    </h1>

                    {/* TAGS */}
                    <div className="flex flex-wrap items-center gap-3 mt-4">

                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">

                        STOCK TRACKING

                      </div>

                      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">

                        SUPPLY CHAIN

                      </div>

                      <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide hidden sm:flex">

                        SMART INVENTORY

                      </div>

                    </div>

                  </div>

                </div>

                {/* DESCRIPTION */}
                <p className="text-gray-600 text-[17px] leading-relaxed max-w-2xl mt-6">

                  Monitor stock levels, supply chain workflows,
                  warehouse operations and enterprise inventory
                  movement from one centralized ERP platform.

                </p>

                {/* STATUS */}
                <div className="flex flex-wrap items-center gap-3 mt-6">

                  {/* ACTIVE */}
                  <div className="flex items-center gap-2 bg-emerald-100/80 backdrop-blur-xl text-emerald-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-emerald-200 shadow-sm">

                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>

                    Inventory Active

                  </div>

                  {/* STOCK */}
                  <div className="bg-amber-100/80 backdrop-blur-xl text-amber-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-amber-200 shadow-sm">

                    Live Stock Monitoring

                  </div>

                  {/* SUPPLY */}
                  <div className="bg-orange-100/80 backdrop-blur-xl text-orange-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-orange-200 shadow-sm">

                    Supply Chain Connected

                  </div>

                </div>

              </div>

              {/* RIGHT */}
              <div className="flex flex-col gap-4 xl:min-w-[340px]">

                {/* SEARCH */}
                <div className="relative">

                  <input
                    placeholder="Search product..."
                    className="border border-white/50 pl-5 pr-5 py-4 rounded-[24px] w-full bg-white/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-4 focus:ring-amber-200 transition-all duration-300 text-[15px]"
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                  />

                </div>

                {/* QUICK STATUS */}
                <div className="flex items-center gap-3">

                  <div className="flex-1 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white px-5 py-4 rounded-[22px] shadow-[0_12px_30px_rgba(245,158,11,0.35)] font-semibold text-sm text-center">

                    Enterprise Stock Intelligence

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ANALYTICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-5 mb-8">

            {[
              {
                title: "Total Products",
                value: items.length,
                icon: <Package size={28} />,
                gradient: "from-blue-500 to-cyan-400",
              },
              {
                title: "Low Stock",
                value: lowStockCount,
                icon: <AlertTriangle size={28} />,
                gradient: "from-red-500 to-orange-400",
              },
              {
                title: "Purchase Orders",
                value: purchaseOrders.length,
                icon: <ShoppingCart size={28} />,
                gradient: "from-purple-600 to-pink-500",
              },
              {
                title: "Pending Orders",
                value: pendingOrdersCount,
                icon: <ShoppingCart size={28} />,
                gradient: "from-green-500 to-emerald-400",
              },
              {
                title: "Stock Movements",
                value: stockMovements.length,
                icon: <ArrowUpDown size={28} />,
                gradient: "from-indigo-600 to-blue-500",
              },
            ].map((card, index) => (

              <motion.div
                key={index}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`relative overflow-hidden bg-gradient-to-br ${card.gradient} text-white rounded-3xl p-5 shadow-lg`}
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-white/80">
                      {card.title}
                    </p>

                    <h2 className="text-4xl font-bold mt-3">
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

          {/* CREATE SKU */}
          {role === "ADMIN" && (

            <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/40 mb-8">

              <div className="mb-6">

                <h2 className="text-3xl font-bold text-[#111827]">

                  {editingId
                    ? "Update Inventory SKU"
                    : "Create Inventory SKU"}

                </h2>

                <p className="text-gray-500 mt-2">
                  Create inventory products for stock management
                </p>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">

                <input
                  placeholder="Product Name"
                  className="p-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={productName}
                  onChange={(e) =>
                    setProductName(
                      e.target.value
                    )
                  }
                />

                <input
                  placeholder="SKU"
                  className="p-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={sku}
                  onChange={(e) =>
                    setSku(
                      e.target.value
                    )
                  }
                />

                <input
                  placeholder="Quantity"
                  type="number"
                  className="p-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      e.target.value
                    )
                  }
                />

                <input
                  placeholder="Price"
                  type="number"
                  className="p-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={price}
                  onChange={(e) =>
                    setPrice(
                      e.target.value
                    )
                  }
                />

                <input
                  placeholder="Category"
                  className="p-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="flex gap-3 mt-6">

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {

                    if (editingId) {

                      const confirmed =
                        window.confirm(
                          "Update inventory item?"
                        );

                      if (!confirmed) {
                        return;
                      }

                      updateProduct();

                    } else {

                      const confirmed =
                        window.confirm(
                          "Create inventory SKU?"
                        );

                      if (!confirmed) {
                        return;
                      }

                      addProduct();
                    }
                  }}
                  className="bg-blue-600 text-white px-7 py-3 rounded-2xl hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-xl font-medium"
                >

                  {editingId
                    ? "Update Inventory"
                    : "Create Inventory SKU"}

                </motion.button>

                {editingId && (

                  <button
                    onClick={() => {

                      setEditingId("");

                      setProductName("");

                      setSku("");

                      setQuantity("");

                      setPrice("");

                      setCategory("");
                    }}
                    className="px-7 py-3 rounded-2xl bg-gray-200 text-gray-700 font-medium"
                  >

                    Cancel

                  </button>

                )}

              </div>

            </div>

          )}

          {/* PURCHASE + STOCK */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">

            {/* PURCHASE ORDERS */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl relative overflow-hidden p-6 shadow-xl border border-white/40">

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-pink-500"></div>

              <div className="flex items-center justify-between mb-6">

                <div>

                  <h2 className="text-3xl font-bold text-[#111827]">
                    Purchase Orders
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Procurement workflow
                  </p>

                </div>

                <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {purchaseOrders.length} orders
                </span>

              </div>

              {/* FORM */}
              {role === "ADMIN" && (

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                  <input
                    placeholder="Vendor Name"
                    className="border border-gray-300 p-3 rounded-2xl"
                    value={vendorName}
                    onChange={(e) =>
                      setVendorName(
                        e.target.value
                      )
                    }
                  />

                  <select
                    className="border border-gray-300 p-3 rounded-2xl bg-white"
                    value={poProductName}
                    onChange={(e) =>
                      setPoProductName(
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Select Product
                    </option>

                    {items.map((item: any) => (

                      <option
                        key={item.id}
                        value={item.productName}
                      >
                        {item.productName}
                      </option>

                    ))}

                  </select>

                  <input
                    type="number"
                    placeholder="Quantity"
                    className="border border-gray-300 p-3 rounded-2xl"
                    value={poQuantity}
                    onChange={(e) =>
                      setPoQuantity(
                        e.target.value
                      )
                    }
                  />

                  <input
                    type="number"
                    placeholder="Price"
                    className="border border-gray-300 p-3 rounded-2xl"
                    value={poPrice}
                    onChange={(e) =>
                      setPoPrice(
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
                          "Create purchase order?"
                        );

                      if (!confirmed) {
                        return;
                      }

                      createPurchaseOrder();

                    }}
                    className="bg-purple-600 text-white py-3 rounded-2xl hover:bg-purple-700 transition-all duration-300 md:col-span-2 shadow-md"
                  >
                    Create Purchase Order
                  </motion.button>

                </div>

              )}

              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">

                {purchaseOrders.length === 0 ? (

                  <div className="py-10 text-center text-gray-500">
                    No purchase orders found
                  </div>

                ) : (

                  purchaseOrders.map(
                    (item: any) => (

                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        key={item.id}
                        className="border border-gray-200 rounded-2xl p-5 bg-white/70 hover:shadow-md transition-all duration-300"
                      >

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                          <div>

                            <h3 className="font-bold text-lg text-[#111827]">
                              {item.productName}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                              Vendor: {item.vendorName}
                            </p>

                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>

                          </div>

                          <div className="text-right">

                            <p className="font-bold text-purple-600 text-xl">
                              ₹{item.price}
                            </p>

                            <div className="mt-3">

                              {item.status === "COMPLETED" ? (
                                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                                  COMPLETED
                                </span>
                              ) : role === "ADMIN" ? (
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  whileHover={{ scale: 1.05 }}
                                  onClick={() => {

                                    const confirmed =
                                      window.confirm(
                                        "Complete this purchase order?"
                                      );

                                    if (!confirmed) {
                                      return;
                                    }

                                    completePurchaseOrder(item.id);
                                  }}
                                  className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-green-700 transition-all duration-300"
                                >
                                  Complete
                                </motion.button>
                              ) : (
                                <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold">
                                  PENDING
                                </span>
                              )}

                            </div>

                          </div>

                        </div>

                      </motion.div>

                    ))

                )}

              </div>

            </div>

            {/* STOCK MOVEMENTS */}
            {(
              role === "ADMIN" ||
              role === "MANAGER" ||
              role === "FINANCE"
            ) && (

                <div className="bg-white/70 backdrop-blur-xl rounded-3xl relative overflow-hidden p-6 shadow-xl border border-white/40">

                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-400"></div>

                  <div className="flex items-center justify-between mb-6">

                    <div>

                      <h2 className="text-3xl font-bold text-[#111827]">
                        Stock Movements
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        Inventory audit trail
                      </p>

                    </div>

                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {stockMovements.length} records
                    </span>

                  </div>

                  <div className="space-y-4 max-h-[560px] overflow-y-auto pr-2 custom-scrollbar">

                    {stockMovements.length === 0 ? (

                      <div className="py-10 text-center text-gray-500">
                        No stock movements found
                      </div>

                    ) : (

                      stockMovements.map((item: any) => (

                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          key={item.id}
                          className="border border-gray-200 rounded-2xl p-5 bg-white/70 hover:shadow-md transition-all duration-300"
                        >

                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                            <div>

                              <h3 className="font-bold text-lg text-[#111827]">
                                {item.productName}
                              </h3>

                              <p className="text-sm text-gray-500 mt-1">
                                Ref: {item.reference || "-"}
                              </p>

                              <p className="text-sm text-gray-500">
                                {new Date(
                                  item.createdAt
                                ).toLocaleString()}
                              </p>

                            </div>

                            <div className="text-right">

                              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                                {item.type}
                              </span>

                              <p
                                className={`font-bold text-xl mt-3 ${item.type === "OUT"
                                  ? "text-red-600"
                                  : "text-green-600"
                                  }`}
                              >
                                {item.type === "OUT"
                                  ? "-"
                                  : "+"}
                                {item.quantity}
                              </p>

                            </div>

                          </div>

                        </motion.div>

                      ))

                    )}

                  </div>

                </div>
              )}
          </div>

          {/* INVENTORY TABLE */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 max-w-full overflow-x-auto">

            <div className="p-6 border-b border-gray-100 flex items-center justify-between">

              <div>

                <h2 className="text-3xl font-bold text-[#111827]">
                  Inventory List
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Real-time inventory visibility
                </p>

              </div>

              <span className="bg-gray-100 text-gray-700 text-sm font-semibold px-4 py-2 rounded-full">
                {items.length} products
              </span>

            </div>

            {/* HEADER */}
            <div className="min-w-[1000px] grid grid-cols-6 px-6 py-5 bg-gray-50 text-gray-500 font-semibold text-sm border-b">

              <div>Product</div>
              <div>SKU</div>
              <div>Quantity</div>
              <div>Price</div>
              <div>Category</div>
              <div>Actions</div>

            </div>

            {/* BODY */}
            {loading ? (
              <div className="animate-pulse p-6 space-y-4">

                <div className="h-16 bg-slate-200 rounded-2xl"></div>

                <div className="h-16 bg-slate-200 rounded-2xl"></div>

                <div className="h-16 bg-slate-200 rounded-2xl"></div>

                <div className="h-16 bg-slate-200 rounded-2xl"></div>

                <div className="h-16 bg-slate-200 rounded-2xl"></div>

              </div>


            ) : items.length === 0 ? (

              <div className="py-14 flex flex-col items-center justify-center text-center">

                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-4xl">
                  📦
                </div>

                <h3 className="text-xl font-semibold text-gray-700">
                  No Inventory Found
                </h3>

                <p className="text-gray-500 mt-2">
                  Create inventory products to manage stock.
                </p>

              </div>

            ) : (

              items.map((item: any) => (

                <motion.div
                  whileHover={{ scale: 1.005 }}
                  key={item.id}
                  className="grid grid-cols-6 px-6 py-5 border-b items-center hover:bg-white transition-all duration-200"
                >

                  <div className="font-semibold text-[#111827]">
                    {item.productName}
                  </div>

                  <div className="text-gray-600">
                    {item.sku}
                  </div>

                  <div>

                    <span
                      className={
                        item.quantity <= 5
                          ? "text-red-500 font-bold"
                          : "font-semibold text-[#111827]"
                      }
                    >
                      {item.quantity}
                    </span>

                    {item.quantity <= 5 && (

                      <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                        Low Stock
                      </span>

                    )}

                  </div>

                  <div className="text-green-600 font-bold">
                    ₹{item.price}
                  </div>

                  <div>
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {item.category}
                    </span>
                  </div>

                  <div>

                    {role === "ADMIN" ? (

                      <div className="flex gap-3">

                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          whileHover={{ scale: 1.05 }}
                          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-200 transition-all duration-300"
                          onClick={() => {

                            setEditingId(
                              item.id
                            );

                            setProductName(
                              item.productName
                            );

                            setSku(
                              item.sku
                            );

                            setQuantity(
                              item.quantity.toString()
                            );

                            setPrice(
                              item.price.toString()
                            );

                            setCategory(
                              item.category
                            );
                          }}
                        >
                          Edit
                        </motion.button>

                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          whileHover={{ scale: 1.05 }}
                          className="bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-200 transition-all duration-300"
                          onClick={() => {

                            const confirmDelete =
                              window.confirm(
                                `Delete ${item.productName}?`
                              );

                            if (!confirmDelete) {
                              return;
                            }

                            deleteProduct(item.id);

                          }}
                        >
                          Delete
                        </motion.button>

                      </div>

                    ) : (

                      <span className="text-gray-400 text-sm">
                        View Only
                      </span>

                    )}

                  </div>

                </motion.div>

              ))
            )}

          </div>

        </motion.div>

      </div>


    </AuthGuard>
  );
}