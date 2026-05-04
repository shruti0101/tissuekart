"use client"

import { useEffect, useState } from "react"
import { LogOut } from "lucide-react"

export default function Dashboard() {

  const [orders, setOrders] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = JSON.parse(localStorage.getItem("user"))

    setUser(userData)

    fetch("/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setOrders(data)
        else setOrders([])
      })
  }, [])

  const totalSpent = orders.reduce((acc, o) => acc + (o.total || 0), 0)

  //  LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  return (

    <div className="min-h-screen bg-white mt-10 md:mt-20  px-6">

      <div className="max-w-7xl mx-auto">

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-10">

          <h1 className="text-4xl font-bold tracking-tight">
            My Dashboard
          </h1>

          {/* USER + LOGOUT */}
          <div className="flex items-center gap-4">

            {/* AVATAR */}
            {user?.avatar ? (
              <img
                src={user.avatar}
                className="w-10 h-10 rounded-full object-cover border"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center font-bold">
                {user?.name?.charAt(0) || "U"}
              </div>
            )}

            {/* LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:opacity-90 transition"
            >
              <LogOut size={16} />
              Logout
            </button>

          </div>

        </div>

        {/* PROFILE + STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">

          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/40">
            <div className="flex items-center gap-4">

              {/* AVATAR BIG */}
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  className="w-14 h-14 rounded-full object-cover border"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center text-xl font-bold">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}

              <div>
                <p className="font-semibold text-lg">{user?.name}</p>
                <p className="text-gray-500 text-sm">{user?.email}</p>
              </div>

            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 text-center border border-white/40 hover:scale-[1.02] transition">
            <p className="text-gray-500 text-sm">Total Orders</p>
            <h2 className="text-3xl font-bold mt-1">{orders.length}</h2>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 text-center border border-white/40 hover:scale-[1.02] transition">
            <p className="text-gray-500 text-sm">Total Spent</p>
            <h2 className="text-3xl font-bold mt-1">₹{totalSpent}</h2>
          </div>

        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <p className="text-xl font-medium mb-4">
              You haven’t placed any orders yet
            </p>

            <a
              href="/"
              className="inline-block bg-black text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
            >
              Start Shopping
            </a>
          </div>
        )}

        {/* ORDERS */}
        <div className="space-y-6">

          {orders.map(order => {

            const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric"
            })

            return (
              <div
                key={order._id}
                className="bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl p-6 border border-white/40 hover:shadow-xl transition"
              >

                <div className="flex justify-between items-start mb-5">

                  <div>
                    <p className="font-semibold text-lg">
                      Order ID: {order.orderId || order._id}
                    </p>

                    <p className="text-gray-500 text-sm mt-1">
                      {formattedDate}
                    </p>

                 
                  </div>

                  <div className="text-2xl font-bold text-gray-900">
                    ₹{order.total}
                  </div>

                </div>

                <div className="space-y-4 border-t pt-5">

                  {order.products.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">

                      <img
                        src={item.image}
                        className="w-16 h-16 rounded-xl object-cover border shadow-sm"
                      />

                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <div className="font-semibold text-gray-800">
                        ₹{item.price * item.quantity}
                      </div>

                    </div>
                  ))}

                </div>

              </div>
            )
          })}

        </div>

      </div>

    </div>
  )
}