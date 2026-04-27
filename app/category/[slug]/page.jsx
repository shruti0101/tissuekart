"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function CategoryPage() {
  const { slug } = useParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <section className="bg-[#F3F3F3] min-h-screen font-serif">

      {/* Breadcrumb */}
      <div className="text-center mb-6 text-gray-600 pt-6">
        <Link href="/" className="hover:text-black">Home</Link>{" "}
        / <span className="text-black font-medium capitalize">{slug}</span>
      </div>

      {/* Title */}
      <h1 className="text-center text-5xl font-serif font-semibold mb-12 capitalize tracking-tight">
        {slug}
      </h1>

      <div className="max-w-[1500px] mx-auto flex gap-8 px-6 items-start">

        {/* Sidebar */}
        <div className="w-[260px] bg-white rounded-md shadow-sm p-6 max-h-[520px] overflow-y-auto sticky top-6">
          <h2 className="text-2xl font-serif mb-6 border-b pb-3">
            Categories
          </h2>

          <ul className="space-y-4 text-lg font-serif">
            {categories.map((cat) => (
              <li key={cat._id}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="hover:text-teal-700 transition block "
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Product Grid */}
        <div className="flex-1">

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center h-[300px] w-full">
              <p className="text-gray-500">Loading products...</p>
            </div>
          )}

          {/* Empty */}
          {!loading && products.length === 0 && (
            <div className="flex justify-center items-center h-[300px] w-full">
              <p className="text-gray-500">No products found</p>
            </div>
          )}

          {/* Grid */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-4 gap-8">

              {products.map((product) => (
                <Link   href={`/product/${product.slug}`}
                  key={product._id}
                  className="bg-white rounded-md shadow-sm p-6 relative text-center hover:shadow-md transition flex flex-col justify-between"
                >
                  {/* Discount */}
                  {product.oldPrice && (
                    <div className="absolute right-4 top-4 bg-teal-700 text-white text-sm px-3 py-1 rounded-md font-semibold">
                      {Math.round(
                        ((product.oldPrice - product.price) / product.oldPrice) * 100
                      )}% OFF
                    </div>
                  )}

                  {/* Brand */}
                  <p className="text-sm text-start text-black capitalize  mb-3">
                 papyrus
                  </p>

               {/* Image */}
<div className="relative group flex justify-center items-center mb-5 h-[150px] overflow-hidden">

  <Image
    src={product.images?.[0] || "/placeholder.png"}
    alt={product.name}
    width={160}
    height={150}
    className="object-cover transition duration-300 group-hover:scale-105"
  />

  {/* Hover Overlay */}
  <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
    
    <button className="bg-[#B97A56] text-white cursor-pointer px-7 py-2 text-md font-semibold  hover:bg-teal-700 hover:text-white transition">
      Add to Cart
    </button>

  </div>
</div>

                  {/* Name */}
                  <div
                  
                    className="block font-serif text-lg font-semibold mb-3 leading-snug min-h-[48px]"
                  >
                    {product.name}
                  </div>

                  {/* Price */}
                  <div className="flex justify-center gap-3 items-center mt-auto">
                    <span className="text-teal-700 font-semibold text-lg">
                      ₹{product.price}
                    </span>

                    {product.oldPrice > 0 && (
                      <span className="text-gray-400 line-through">
                        ₹{product.oldPrice}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}