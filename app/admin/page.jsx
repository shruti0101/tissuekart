"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Users, Boxes, IndianRupee } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();







  //  LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/"
  }
  const [stats, setStats] = useState({
    orders: 0,
  
    users: 0,
    products: 0,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, Icon }) => (
    <div className="group bg-white/70 backdrop-blur-xl border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <Icon className="w-5 h-5 text-gray-400 group-hover:text-black transition" />
      </div>
      <h2 className="text-3xl font-semibold mt-3 text-gray-900 tracking-tight">
        {value}
      </h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2f7] p-6 md:p-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Business overview & performance
          </p>
        </div>


   

        <button
       onClick={handleLogout}
          className="bg-red-600 text-white px-5 py-2.5 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition cursor-pointer"
        >
          LOGOUT 
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <StatCard
          title="Total Orders"
          value={stats.orders}
          Icon={Package}
        />

    

        <StatCard
          title="Users"
          value={stats.users}
          Icon={Users}
        />

        <StatCard
          title="Products"
          value={stats.products}
          Icon={Boxes}
        />

      </div>

      {/* QUICK ACTIONS */}
      <div className="mt-14 grid md:grid-cols-3 gap-6">

        <div
          onClick={() => router.push("/admin/orders")}
          className="group bg-black text-white p-6 rounded-2xl cursor-pointer hover:scale-[1.02] transition-all duration-300 shadow-lg"
        >
          <h3 className="text-lg font-semibold">Manage Orders</h3>
          <p className="text-sm mt-2 opacity-80">
            Track Orders and Assign Courier Partner
          </p>
        </div>

    

        <div
          onClick={() => router.push("/admin/add-product")}
          className="group bg-white border border-gray-200 p-6 rounded-2xl cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <h3 className="text-lg font-semibold text-gray-900">
            Add Product
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Create new product listings
          </p>
        </div>

        <div
          onClick={() => router.push("/admin/products")}
          className="group bg-white border border-gray-200 p-6 rounded-2xl cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <h3 className="text-lg font-semibold text-gray-900">
            All Products
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Edit or delete products
          </p>
        </div>

        <div
          onClick={() => router.push("/admin/categories")}
          className="group bg-white border border-gray-200 p-6 rounded-2xl cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <h3 className="text-lg font-semibold text-gray-900">
            Categories
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Organize categories
          </p>
        </div>

         
        <div
         onClick={() =>
            window.open(
              "https://app.shiprocket.in/seller/orders",
              "_blank"
            )
          }
          className="group bg-white text-white p-6 rounded-2xl cursor-pointer hover:scale-[1.02] transition-all duration-300 shadow-lg"
        >



           <div
        
          className=" text-black font-bold "
        >
          View Orders in Shiprocket  →
        </div>
        </div>

      </div>

    </div>
  );
}