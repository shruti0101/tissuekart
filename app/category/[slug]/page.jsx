"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useCartStore } from "@/components/store/cartStore";
export default function CategoryPage() {
  const { slug } = useParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
const addToCart = useCartStore((state) => state.addToCart);
  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [catRes, prodRes] = await Promise.all([
          fetch("/api/categories"),
          fetch(`/api/products?category=${slug}`),
        ]);

        const catData = await catRes.json();
        const prodData = await prodRes.json();

        setCategories(catData);
        setProducts(prodData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  return (
  <section className="bg-[#F3F3F3] min-h-screen font-serif mt-15   md:mt-35  ">

  {/* Breadcrumb */}
  <div className="text-center mb-4 sm:mb-6 text-gray-600 pt-4 sm:pt-6 text-sm">
    <Link href="/" className="hover:text-black">Home</Link>{" "}
    / <span className="text-black font-medium capitalize">{slug}</span>
  </div>

  {/* Title */}
  <h1 className="text-center text-2xl sm:text-4xl md:text-5xl font-serif font-semibold mb-6 sm:mb-10 md:mb-12 capitalize tracking-tight">
    {slug}
  </h1>

  <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-6 sm:gap-8 px-4 sm:px-6 items-start">

    {/* Sidebar */}
    <div className="w-full lg:w-[260px] bg-white rounded-md shadow-sm p-4 sm:p-6 max-h-[520px] overflow-y-auto lg:sticky lg:top-36">
      <h2 className="text-xl sm:text-2xl font-serif mb-4 sm:mb-6 border-b pb-2 sm:pb-3">
        Categories
      </h2>

      <ul className="space-y-3 sm:space-y-4 text-sm sm:text-[17px] font-serif">
        {categories.map((cat) => (
          <li key={cat._id}>
            <Link
              href={`/category/${cat.slug}`}
              className="hover:text-teal-700 transition block"
            >
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>

    {/* Product Grid */}
    <div className="flex-1 w-full">

      {/* Empty */}
      {!loading && products.length === 0 && (
        <div className="flex justify-center items-center h-[200px] sm:h-[280px] w-full">
          <p className="text-gray-500 text-sm sm:text-base">No products found</p>
        </div>
      )}

      {/* Grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 ">

          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-md shadow-sm p-4 sm:p-6 relative text-center hover:shadow-md transition flex flex-col justify-between"
            >
              {/* Discount */}
              {product.oldPrice && (
                <div className="absolute right-2 sm:right-4 top-2 sm:top-4 bg-teal-700 text-white text-[10px]  px-2 sm:px-3 py-1 rounded-md font-semibold">
                  {Math.round(
                    ((product.oldPrice - product.price) / product.oldPrice) * 100
                  )}% OFF
                </div>
              )}

              {/* Brand */}
              <p className="text-xs sm:text-sm text-start text-black capitalize mb-2 sm:mb-3">
                papyrus
              </p>

              {/* Image */}
              <div className="relative group flex justify-center items-center mb-3 sm:mb-5 h-[120px] sm:h-[150px] overflow-hidden">

                <Image
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  width={160}
                  height={150}
                  className="object-cover transition duration-300 group-hover:scale-105"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, 1);
                    }}
                    className="bg-[#B97A56] text-white px-4 sm:px-7 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold hover:bg-teal-700 transition"
                  >
                    Add to Cart
                  </button>

                </div>
              </div>

              {/* Name */}
              <Link
                href={`/product/${product.slug}`}
                className="block text-sm sm:text-[17px] font-semibold leading-snug min-h-[40px]  hover:text-teal-800"
              >
                {product.name}
              </Link>

          
              {/* Price */}
              <div className="flex justify-center gap-2 sm:gap-3 items-center mt-auto">
                <span className="text-teal-700 font-semibold text-sm sm:text-lg">
                  ₹{product.price}
                </span>

                {product.oldPrice > 0 && (
                  <span className="text-gray-400 line-through text-xs sm:text-base">
                    ₹{product.oldPrice}
                  </span>
                )}
              </div>

                  <p className="capitalize w-fit mx-auto px-10 bg-[#DCFCE7] mt-2 text-teal-900 text-xs rounded-2xl py-1">inclusive of all taxes</p>

            </div>
          ))}

        </div>
      )}
    </div>
  </div>
</section>
  );
}