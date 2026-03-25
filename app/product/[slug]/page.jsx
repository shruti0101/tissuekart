"use client";
import { useWishlistStore } from "@/components/store/wishlistStore"

import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/components/store/cartStore"
import {  Heart } from "lucide-react"
import toast from "react-hot-toast"
import { useParams } from "next/navigation";
import { categories } from "@/Data";
export default function ProductPage() {
 
const { slug } = useParams();

  // find product inside categories
  const product = categories
    .flatMap((cat) => cat.products)
    .find((p) => p.slug === slug);

  if (!product) {
    return <div className="text-center py-20">Product not found</div>;
  }


  
  const [quantity, setQuantity] = useState(1);

  const increaseQty = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

const addItem = useCartStore((state) => state.addToCart)

const addToCart = () => {
  addItem(product, quantity)

  showToast("Added to cart 🛒")
}




const handleWishlist = () => {

  if (inWishlist) {
    removeWishlist(product.id)
    toast("Removed from wishlist ❌")
  } else {
    addWishlist(product)
    toast.success("Added to wishlist ❤️")
  }

}


  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [tab, setTab] = useState("description");


const wishlist = useWishlistStore((state) => state.wishlist)
const addWishlist = useWishlistStore((state) => state.addToWishlist)
const removeWishlist = useWishlistStore((state) => state.removeFromWishlist)

const inWishlist = wishlist.some((item) => item.id === product.id)





const showToast = (message) => {
  toast(
    (t) => (
      <div className="flex items-center gap-3">

        <img
          src={product.images[0]}
          className="w-12 h-12 rounded object-cover"
        />

        <div>
          <p className="font-semibold">{product.name}</p>
          <p className="text-sm text-gray-500">{message}</p>
        </div>

      </div>
    ),
    {
      duration: 2500,
    }
  )
}
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        Home / {product.category} / {product.name}
      </div>

      {/* Top Section */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Left Images */}
        <div>
          <div className="border rounded-xl p-6 bg-gray-50">
            <Image
              src={activeImage}
              alt={product.name}
              width={500}
              height={500}
              className="mx-auto"
            />
          </div>

          <div className="flex gap-3 mt-4">
            {product.images.map((img, i) => (
              <div
                key={i}
                onClick={() => setActiveImage(img)}
                className="border p-1 rounded cursor-pointer hover:border-green-600"
              >
                <Image src={img} width={70} height={70} alt="" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Info */}
        <div>
          <p className="text-gray-500 text-sm">{product.category}</p>

          <h1 className="text-3xl font-semibold mt-1">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-yellow-500 text-lg">★★★★★</span>
            <span className="text-gray-500 text-sm">(reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4 mt-5">
            <span className="text-3xl font-bold">₹{product.price}</span>

            <span className="line-through text-gray-400">₹{product.mrp}</span>

            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
              {product.discount}% OFF
            </span>
          </div>

          <p className="text-red-500 text-sm mt-2">Inclusive of all taxes</p>

          {/* Features Box */}
          <div className="bg-[#dceae7] p-5 rounded-lg mt-6">
            <ul className="space-y-2 text-gray-700">
              <li>✓ Ply: {product.ply}</li>
              <li>✓ Size: {product.size}</li>
              <li>✓ Set Of: {product.set}</li>
              <li>✓ Pieces per Set: {product.pieces}</li>
            </ul>
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <p className="font-medium mb-3">Quantity</p>

            <div className="flex items-center gap-4">
              <button
                onClick={decreaseQty}
                className="w-10 h-10 border rounded-lg text-lg hover:bg-gray-100"
              >
                -
              </button>

              <span className="text-lg font-medium">{quantity}</span>

              <button
                onClick={increaseQty}
                className="w-10 h-10 border rounded-lg text-lg hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Add To Cart */}
          <div className="flex items-center gap-6 mt-6">
            <button
              onClick={addToCart}
              className="bg-[#129c97] text-black px-10 py-3 rounded-lg font-semibold hover:bg-[#246a68] transition"
            >
              ADD TO CART
            </button>
        <button
              onClick={handleWishlist}
              className="flex items-center text-lg gap-2"
            >
              <Heart size={25} fill={inWishlist ? "red" : "none"} />
              Add Wishlist
            </button>

          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex gap-10 border-b pb-3">
          <button
            onClick={() => setTab("description")}
            className={`pb-2 ${
              tab === "description"
                ? "text-teal-600 border-b-2 border-teal-600"
                : ""
            }`}
          >
            Description
          </button>

          <button
            onClick={() => setTab("dimension")}
            className={`pb-2 ${
              tab === "dimension"
                ? "text-teal-600 border-b-2 border-teal-600"
                : ""
            }`}
          >
            Dimension
          </button>

          <button
            onClick={() => setTab("reviews")}
            className={`pb-2 ${
              tab === "reviews"
                ? "text-teal-600 border-b-2 border-teal-600"
                : ""
            }`}
          >
            Reviews 0
          </button>
        </div>

        <div className="mt-6 text-gray-700 leading-7">
          {tab === "description" && (
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          )}

          {tab === "dimension" && (
            <p>Product dimension information will appear here.</p>
          )}

          {tab === "reviews" && <p>No reviews yet.</p>}
        </div>
      </div>
    </div>
  );
}
