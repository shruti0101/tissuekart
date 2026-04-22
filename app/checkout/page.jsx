"use client"

import { useCartStore } from "@/components/store/cartStore"

export default function CheckoutPage() {

  const { cart, totalPrice, clearCart } = useCartStore()

  const handleOrder = async () => {

    const token = localStorage.getItem("token")

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        products: cart,
        total: totalPrice()
      })
    })

    const data = await res.json()

    alert("Order placed successfully")

    clearCart()
  }

  return (

    <div className="max-w-4xl mx-auto py-12 px-6">

      <h1 className="text-2xl font-semibold mb-6">
        Checkout
      </h1>

      {cart.map(item => (
        <div key={item.name} className="flex justify-between mb-3">
          <span>{item.name}</span>
          <span>₹{item.price * item.quantity}</span>
        </div>
      ))}

      <div className="mt-6 text-lg font-semibold">
        Total: ₹{totalPrice()}
      </div>

      <button
        onClick={handleOrder}
        className="mt-6 bg-[#129c97] text-white px-6 py-3 rounded-lg"
      >
        Place Order
      </button>

    </div>
  )
}