"use client"

import { useWishlistStore } from "@/components/store/wishlistStore"
import { useCartStore } from "@/components/store/cartStore"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import Link from "next/link"

export default function WishlistPage() {

  const wishlist = useWishlistStore((state) => state.wishlist)
  const remove = useWishlistStore((state) => state.removeFromWishlist)

  const addToCart = useCartStore((state) => state.addToCart)

  return (

    <section className="bg-gray-50 min-h-screen py-16 px-6">

      <div className="max-w-7xl mx-auto">

        {/* Page Header */}

        <div className="flex items-center justify-between mb-12">

          <h1 className="text-3xl font-semibold flex items-center gap-2">
            <Heart className="text-red-500" />
            Your Wishlist
          </h1>

          <p className="text-gray-500">
            {wishlist.length} items saved
          </p>

        </div>


        {/* Empty State */}

        {wishlist.length === 0 && (

          <div className="bg-white rounded-xl shadow-sm p-20 text-center">

            <Heart size={50} className="mx-auto text-gray-300 mb-4" />

            <h2 className="text-xl font-semibold mb-2">
              Your wishlist is empty
            </h2>

            <p className="text-gray-500 mb-6">
              Save products you love to your wishlist.
            </p>

            <Link
              href="/"
              className="inline-block bg-[#129c97] text-white px-6 py-3 rounded-lg hover:bg-[#0f7d79] transition"
            >
              Continue Shopping
            </Link>

          </div>

        )}


        {/* Wishlist Products */}

        {wishlist.length > 0 && (

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

            {wishlist.map((item) => (

              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition overflow-hidden"
              >

                {/* Product Image */}

                <div className="relative">

                  <img
                    src={item.img}
                    className="w-full h-[220px] object-contain p-6"
                  />

                  <button
                    onClick={() => remove(item.id)}
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>


                {/* Product Info */}

                <div className="p-5">

                  <h3 className="font-medium text-lg mb-2">
                    {item.name}
                  </h3>

                  <p className="text-[#129c97] font-semibold mb-4">
                    ₹{item.price}
                  </p>

                  {/* Actions */}

                  <div className="flex gap-2">

                    <button
                      onClick={() => addToCart(item,1)}
                      className="flex-1 bg-[#129c97] text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#0f7d79] transition"
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>

                    <button
                      onClick={() => remove(item.id)}
                      className="border px-3 rounded-lg hover:bg-gray-100"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </section>

  )

}