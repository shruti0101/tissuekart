"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function OrderSuccess() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get("orderId");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md">

        <div className="text-green-500 text-6xl mb-4">✅</div>

        <h1 className="text-2xl font-bold mb-2">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600 mb-4">
          Thank you for your order 🎉
        </p>

        {orderId && (
          <p className="text-sm text-gray-500 mb-6">
            Order ID: <span className="font-semibold">{orderId}</span>
          </p>
        )}

        <button
          onClick={() => router.push("/")}
          className="bg-[#05847b] text-white px-6 py-3 rounded-lg w-full"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}