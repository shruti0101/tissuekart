"use client"

import { useCartStore } from "@/components/store/cartStore"
import Link from "next/link"
import { X, Plus, Minus, ShoppingBag } from "lucide-react"

export default function CartDrawer() {

  const { cart, cartOpen, closeCart, removeItem, updateQty, totalPrice } =
    useCartStore()

  if (!cartOpen) return null

  return (

    <div className="fixed inset-0 z-[999] flex justify-end">

      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* drawer */}
      <div className="relative w-[420px] max-w-full bg-white h-full shadow-2xl flex flex-col animate-slideIn">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">

          <div className="flex items-center gap-2 font-semibold text-lg">
            <ShoppingBag size={20} />
            Your Cart
          </div>

          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20}/>
          </button>

        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {cart.length === 0 && (

            <div className="text-center py-20 text-gray-500">
              Your cart is empty
            </div>

          )}

          {cart.map((item, index) => (

            <div key={index} className="flex gap-4 mb-6">

              <img
                src={item.images[0]}
                className="w-[70px] h-[70px] rounded-lg object-cover border"
              />

              <div className="flex-1">

                <h3 className="font-medium text-sm">
                  {item.name}
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  ₹{item.price}
                </p>

                {/* quantity */}
                <div className="flex items-center gap-2 mt-3">

                  <button
                    onClick={() =>
                      updateQty(item._id, item.quantity - 1)
                    }
                    className="p-1 border rounded-md hover:bg-gray-100"
                  >
                    <Minus size={14}/>
                  </button>

                  <span className="text-sm font-medium">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateQty(item._id, item.quantity + 1)
                    }
                    className="p-1 border rounded-md hover:bg-gray-100"
                  >
                    <Plus size={14}/>
                  </button>

                </div>

              </div>

              {/* remove */}
              <button
                onClick={() => removeItem(item._id)}
                className="text-gray-400 hover:text-red-500"
              >
                <X size={16}/>
              </button>

            </div>

          ))}

        </div>

        {/* Footer */}
        <div className="border-t p-6 space-y-4">

          {/* subtotal */}
          <div className="flex justify-between text-lg font-semibold">
            <span>Subtotal</span>
            <span>₹{totalPrice()}</span>
          </div>

          {/* cart page */}
          <Link
            href="/cart"
            onClick={closeCart}
            className="block text-center border border-gray-300 py-3 rounded-xl hover:bg-gray-100 transition"
          >
            View Cart
          </Link>

          {/* checkout */}
          <Link
            href="/checkout"
            onClick={closeCart}
            className="block text-center bg-[#129c97] text-white py-3 rounded-xl hover:bg-[#0f7d79] transition font-medium"
          >
            Checkout
          </Link>

        </div>

      </div>


    </div>
  )
}