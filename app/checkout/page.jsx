"use client"

import { useEffect, useState } from "react"
import { useCartStore } from "@/components/store/cartStore"

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCartStore()

  const [paymentMethod, setPaymentMethod] = useState("online")
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    pincode: ""
  })

  const TOKEN_DISCOUNT = 10
  const finalAmount = Math.max(0, totalPrice() - TOKEN_DISCOUNT)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCheckout = async () => {
    const token = localStorage.getItem("token")

    if (paymentMethod === "cod") {
      await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          products: cart,
          total: finalAmount,
          paymentMethod: "cod",
          ...form
        })
      })

      alert("Order placed with COD")
      clearCart()
      return
    }

    // ONLINE PAYMENT
    const res = await fetch("/api/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: finalAmount })
    })

    const order = await res.json()

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Tissue Kart",
      order_id: order.id,

      handler: async function (response) {
        const verifyRes = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            products: cart,
            total: finalAmount,
            paymentMethod: "razorpay",
            ...form,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          })
        })

        const data = await verifyRes.json()

        if (data.order) {
          alert("✅ Payment successful")
          clearCart()
        } else {
          alert("❌ Payment failed")
        }
      },

      theme: { color: "#05847b" }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT FORM */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">

          <h2 className="text-xl font-bold mb-4">Customer Details</h2>

          <div className="space-y-4">

            <input
              name="name"
              placeholder="Name"
              onChange={handleChange}
              className="w-full border border-gray-400 p-3 rounded-lg"
            />

            <input
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
              className="w-full border border-gray-400 p-3 rounded-lg"
            />

            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full border border-gray-400 p-3 rounded-lg"
            />

            <textarea
              name="address"
              placeholder="Address"
              onChange={handleChange}
              className="w-full border border-gray-400 p-3 rounded-lg"
            />

            <input
              name="pincode"
              placeholder="Pincode"
              onChange={handleChange}
              className="w-full border border-gray-400 p-3 rounded-lg"
            />

          </div>

          {/* PAYMENT METHOD */}
          <h2 className="text-xl font-bold mt-6 mb-4">Payment Method</h2>

          <div className="space-y-3">
            <label className="flex items-center border p-4 rounded-lg cursor-pointer">
              <input
                type="radio"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
              />
              <span className="ml-3 font-semibold text-teal-600">
                Pay Online
              </span>
            </label>

            <label className="flex items-center border p-4 rounded-lg cursor-pointer">
              <input
                type="radio"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              <span className="ml-3 font-semibold">
                Cash on Delivery
              </span>
            </label>
          </div>

          <button
            onClick={handleCheckout}
            className="mt-6 w-full bg-[#05847b] text-white py-3 rounded-lg font-semibold hover:bg-[#046b63]"
          >
            Place Order
          </button>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="bg-white h-90 p-6 rounded-lg shadow sticky top-35">

          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.name} className="flex justify-between text-xl">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 flex justify-between">
            <span>Subtotal</span>
            <span>₹{totalPrice()}</span>
          </div>

          <div className="flex justify-between text-teal-600 font-semibold">
            <span>Tissue Token</span>
            <span>- ₹{TOKEN_DISCOUNT}</span>
          </div>

          <div className="border-t mt-2 pt-4 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₹{finalAmount}</span>
          </div>

        </div>

      </div>
    </div>
  )
}