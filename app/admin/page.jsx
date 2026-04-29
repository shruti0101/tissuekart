"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    users: 0,
    products: 0,
  });

  // AUTH CHECK
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      router.push("/login");
    }
  }, []);

  // FAKE STATS (you can replace with API later)
  useEffect(() => {
    setStats({
      orders: 54,
      revenue: 45320,
      users: 1240,
      products: 128,
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f6fb] p-6 md:p-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, Admin 👋
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/orders")}
          className="bg-black text-white px-5 py-2 rounded-xl shadow hover:opacity-90"
        >
          View Orders
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <h2 className="text-3xl font-bold mt-2">{stats.orders}</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Revenue</p>
          <h2 className="text-3xl font-bold mt-2">
            ₹{stats.revenue.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Users</p>
          <h2 className="text-3xl font-bold mt-2">{stats.users}</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Products</p>
          <h2 className="text-3xl font-bold mt-2">{stats.products}</h2>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">

        <div
          onClick={() => router.push("/admin/orders")}
          className="bg-gradient-to-r from-black to-gray-800 text-white p-6 rounded-2xl cursor-pointer hover:scale-[1.02] transition"
        >
          <h3 className="text-lg font-semibold">Manage Orders</h3>
          <p className="text-sm mt-2 opacity-80">
            Track & update customer orders
          </p>
        </div>

        <div
          onClick={() => router.push("/admin/products")}
          className="bg-white p-6 rounded-2xl shadow cursor-pointer hover:shadow-lg transition"
        >
          <h3 className="text-lg font-semibold">Products</h3>
          <p className="text-sm text-gray-500 mt-2">
            Add, edit or delete products
          </p>
        </div>

        <div
          onClick={() => router.push("/admin/categories")}
          className="bg-white p-6 rounded-2xl shadow cursor-pointer hover:shadow-lg transition"
        >
          <h3 className="text-lg font-semibold">Categories</h3>
          <p className="text-sm text-gray-500 mt-2">
            Organize product categories
          </p>
        </div>

      </div>

   

    </div>
  );
}