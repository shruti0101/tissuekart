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

  // ✅ Fetch data
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
    <section className="bg-[#F3F3F3] min-h-screen">

      {/* Breadcrumb */}
      <div className="text-center mb-6 text-gray-600 pt-4">
        <Link href="/" className="hover:text-black">Home</Link>{" "}
        / <span className="text-black font-medium">{slug}</span>
      </div>

      {/* Title */}
      <h1 className="text-center text-5xl font-serif font-semibold mb-12 capitalize">
        {slug}
      </h1>

      <div className="max-w-[1500px] mx-auto flex gap-8 px-6">

        {/* Sidebar */}
        <div className="w-[260px] bg-white rounded-md shadow-sm p-6 h-[520px] overflow-y-auto">
          <h2 className="text-2xl font-serif mb-6 border-b pb-3">
            Categories
          </h2>

          <ul className="space-y-5 text-lg font-serif">
            {categories.map((cat) => (
              <li key={cat._id}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="hover:text-teal-700 transition"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Product Grid */}
        <div className="flex-1 grid grid-cols-4 gap-8">

          {/* ✅ Loading */}
          {loading && <p>Loading products...</p>}

          {/* ✅ Empty state */}
          {!loading && products.length === 0 && (
            <p>No products founddd</p>
          )}

          {!loading &&
            products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-md shadow-sm p-6 relative text-center hover:shadow-md transition"
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
                <p className="text-sm text-gray-500 mb-4">
                  {product.brand || "Brand"}
                </p>

                {/* Image */}
                <div className="flex justify-center mb-6">
                  <Image
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.name}
                    width={140}
                    height={140}
                    className="object-contain"
                  />
                </div>

                {/* Name */}
                <Link
                  href={`/product/${product.slug}`}
                  className="block font-serif text-xl font-semibold mb-4"
                >
                  {product.name}
                </Link>

                {/* Price */}
                <div className="flex justify-center gap-3 items-center">
                  <span className="text-teal-700 font-semibold text-lg">
                    ₹{product.price}
                  </span>

                  {product.oldPrice > 0 && (
                    <span className="text-gray-400 line-through">
                      ₹{product.oldPrice}
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}