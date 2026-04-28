"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/components/store/cartStore";
import { useWishlistStore } from "@/components/store/wishlistStore";

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);

  // filters
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const addToCart = useCartStore((state) => state.addToCart);
  const wishlist = useWishlistStore((state) => state.wishlist);
  const addWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeWishlist = useWishlistStore((state) => state.removeFromWishlist);

  // fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/products");
        const data = await res.json();

        const list = Array.isArray(data) ? data : [];

        setProducts(list);
        setFiltered(list); // ✅ important
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  // ✅ APPLY FILTERS (FIXED)
  const applyFilters = () => {
    let temp = [...products];

    // category filter
    if (selectedCategory) {
      temp = temp.filter(
        (p) => p.category?.slug === selectedCategory
      );
    }

    // min price
    if (minPrice) {
      temp = temp.filter(
        (p) => Number(p.price) >= Number(minPrice)
      );
    }

    // max price
    if (maxPrice) {
      temp = temp.filter(
        (p) => Number(p.price) <= Number(maxPrice)
      );
    }

    setFiltered(temp);
  };

  // ✅ CLEAR FILTER
  const clearFilters = () => {
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setFiltered(products);
  };

  return (

    <>
    
    
    <section className="  ">
      
  <div className="bg-[#f3f3f3] mt-2 ">

      {/* HERO */}
      <div className="bg-[#1f6f6c] text-white text-center py-10">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Explore Our Premium Tissue Collection
        </h1>
        <p className="text-sm mt-3 opacity-90">
          Discover a wide range of tissues, napkins, and hygiene products crafted for comfort and quality.
        </p>
      </div>
      </div>
   

      <div className="max-w-[1400px] mx-auto mt-7 flex gap-6">

        {/* FILTER SIDEBAR */}
        <div className="w-[260px] h-[350px] bg-white rounded-xl shadow p-5 hidden lg:block">

          <h2 className="text-lg font-semibold mb-4">Filter Products</h2>

          {/* CATEGORY */}
          <div className="mb-4">
            <p className="text-sm mb-1">Category</p>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c._id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* PRICE */}
          <div className="mb-4">
            <p className="text-sm mb-1">Price Range</p>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={applyFilters}
              className="flex-1 bg-blue-600 text-white py-2 rounded-md text-sm"
            >
              Apply
            </button>

            <button
              onClick={clearFilters}
              className="flex-1 bg-gray-300 py-2 rounded-md text-sm"
            >
              Clear
            </button>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="flex-1">

          {loading && (
            <div className="flex justify-center items-center h-[300px]">
              <p className="text-gray-500">Loading products...</p>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="flex justify-center items-center h-[300px]">
              <p className="text-gray-500">No products found</p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">

              {filtered.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-md shadow-sm p-4 sm:p-5 md:p-6 relative text-center hover:shadow-md transition flex flex-col justify-between"
                >
                  {product.oldPrice > 0 && (
                    <div className="absolute right-3 top-3 bg-teal-700 text-white text-xs px-2 py-1 rounded-md font-semibold">
                      {Math.round(
                        ((product.oldPrice - product.price) / product.oldPrice) * 100
                      )}% OFF
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-start text-black mb-2 capitalize">
                    papyrus
                  </p>

                  <div className="relative group flex justify-center items-center mb-4 h-[130px] sm:h-[150px] overflow-hidden">
                    <Image
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.name}
                      width={160}
                      height={150}
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product, 1);
                        }}
                        className="bg-[#B97A56] text-white px-5 py-2 text-sm font-semibold hover:bg-teal-700 transition"
                      >
                        Add to Cart
                      </button>

                    
                    </div>
                  </div>

                  <div
                    href={`/product/${product.slug}`}
                    className="block text-sm sm:text-[16px] font-semibold mb-2 leading-snug min-h-[40px] hover:text-teal-800"
                  >
                    {product.name}
                  </div>
<div className="flex justify-between gap-2 items-center mt-auto">

<Link href={`/product/${product.slug}`}
  className="bg-teal-700 p-2 rounded-lg text-white">
    view details
</Link>
                  <div className="flex justify-center gap-2 items-center mt-auto">
                    <span className="text-teal-700 font-semibold text-base sm:text-lg">
                      ₹{product.price}
                    </span>


                     {product.oldPrice > 0 && (
                      <span className="text-gray-400 line-through text-sm">
                        ₹{product.oldPrice}
                      </span>
                    )}
</div>


                   
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
      </div>
    </section>
    </>
  );
}