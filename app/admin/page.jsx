"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);

  // 🔄 Fetch Orders
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }

    const token = localStorage.getItem("token");

    fetch("/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
      });
  }, []);

  // 🔁 Update Status
  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o))
      );
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">📦 Admin Orders</h1>

      {/* ACTION BUTTONS */}
      <div className="mb-6 flex gap-3">
        <Link href="/admin/products">
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg">
            View Products
          </button>
        </Link>

        <Link href="/admin/add-product">
          <button className="bg-black text-white px-5 py-2 rounded-lg">
            + Add Product
          </button>
        </Link>
      </div>

      {/* ORDERS */}
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow-md p-6"
          >
            {/* TOP */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="font-bold text-lg">
                  Order ID: {order.orderId}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              {/* STATUS DROPDOWN */}
              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(order._id, e.target.value)
                }
                className="border px-3 py-2 rounded-lg"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            {/* CUSTOMER */}
            <div className="mb-4">
              <p><strong>Name:</strong> {order.name}</p>
              <p><strong>Phone:</strong> {order.phone}</p>
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>Pincode:</strong> {order.pincode}</p>
            </div>

            {/* PRODUCTS */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Products:</h3>

              <div className="space-y-2">
                {order.products.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between border p-2 rounded-md"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* PAYMENT */}
            <div className="flex justify-between items-center mt-4 border-t pt-4">
              <div>
                <p>
                  <strong>Payment:</strong>{" "}
                  {order.paymentMethod}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {order.paymentStatus}
                </p>
              </div>

              <div className="text-lg font-bold">
                ₹{order.total}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}