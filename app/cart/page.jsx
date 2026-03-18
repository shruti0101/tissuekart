"use client"

import { useCartStore } from "@/components/store/cartStore"
import { Plus, Minus, Trash2 } from "lucide-react"
import Link from "next/link"

export default function CartPage() {

  const { cart, removeItem, updateQty, totalPrice } = useCartStore()

  return (

    <div className="bg-gray-50 min-h-screen py-16 px-6">

      <div className="max-w-7xl mx-auto">

        {/* Page title */}
        <h1 className="text-3xl font-semibold mb-10">
          Shopping Cart
        </h1>

        {cart.length === 0 && (

          <div className="text-center py-24 bg-white rounded-xl shadow-sm">

            <h2 className="text-xl font-medium mb-4">
              Your cart is empty
            </h2>

            <Link
              href="/"
              className="inline-block bg-[#129c97] text-white px-6 py-3 rounded-lg"
            >
              Continue Shopping
            </Link>

          </div>

        )}

        {cart.length > 0 && (

          <div className="grid lg:grid-cols-[2fr_1fr] gap-10">

            {/* Cart Items */}
            <div className="bg-white rounded-xl shadow-sm divide-y">

              {cart.map((item, index) => (

                <div
                  key={index}
                  className="flex items-center gap-6 p-6"
                >

                  <img
                    src={item.images[0]}
                    className="w-[100px] h-[100px] rounded-lg object-cover border"
                  />

                  <div className="flex-1">

                    <h3 className="font-medium text-lg">
                      {item.name}
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                      ₹{item.price}
                    </p>

                    {/* quantity */}
                    <div className="flex items-center gap-3 mt-4">

                      <button
                        onClick={() =>
                          updateQty(item.name, item.quantity - 1)
                        }
                        className="border p-1 rounded-md hover:bg-gray-100"
                      >
                        <Minus size={16}/>
                      </button>

                      <span className="font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQty(item.name, item.quantity + 1)
                        }
                        className="border p-1 rounded-md hover:bg-gray-100"
                      >
                        <Plus size={16}/>
                      </button>

                    </div>

                  </div>

                  {/* price */}
                  <div className="text-lg font-semibold">
                    ₹{item.price * item.quantity}
                  </div>

                  {/* remove */}
                  <button
                    onClick={() => removeItem(item.name)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={18}/>
                  </button>

                </div>

              ))}

            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6 h-fit sticky top-24">

              <h2 className="text-lg font-semibold mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm text-gray-600">

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{totalPrice()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>

                <div className="border-t pt-4 flex justify-between text-lg font-semibold text-black">
                  <span>Total</span>
                  <span>₹{totalPrice()}</span>
                </div>

              </div>

              <Link
                href="/checkout"
                className="block text-center mt-6 bg-[#129c97] text-white py-3 rounded-xl hover:bg-[#0f7d79] transition font-medium"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/"
                className="block text-center mt-4 text-sm text-gray-500 hover:text-black"
              >
                Continue Shopping
              </Link>

            </div>

          </div>

        )}

      </div>

    </div>

  )
}