"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);




const handleAssignCourier = async (orderId) => {
  try {
    const res = await fetch("/api/assign-courier", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId }),
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Courier Assigned");
      location.reload();
    } else {
      alert(data.error);
    }
  } catch (err) {
    console.error(err);
  }
};



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
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen mt-10 md:mt-32">
      <h1 className="text-3xl font-bold mb-8">📦 Admin Orders</h1>

      

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

                  <button
      onClick={() => handleAssignCourier(order.orderId)}
      className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
    >
      Assign Courier 
    </button>


              {/* STATUS DROPDOWN */}
            
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