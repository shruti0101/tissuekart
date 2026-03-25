"use client";

import Image from "next/image";
import Link from "next/link";
import { categories } from "@/Data";
import { useParams } from "next/navigation";



export default function CategoryPage() {

    const params = useParams()

    const slug = params.slug
  // find category
  const category = categories.find((cat) => cat.slug === slug);

  // get products from that category
  const products = category?.products || [];

  return (

    <section  className=" bg-[#F3F3F3   ]">
    
    <div className="bg-[#f3f3f3]  ">

      {/* Breadcrumb */}
      <div className="text-center mb-6 text-gray-600 pt-4">
        <Link href="/" className="hover:text-black">
          Home
        </Link>{" "}
        / <span className="text-black font-medium">Paper Napkin</span>
      </div>

      {/* Title */}
      <h1 className="text-center text-5xl font-serif font-semibold mb-12">
        Paper Napkin
      </h1>

      <div className="max-w-[1500px] mx-auto flex gap-8 px-6">

        {/* Sidebar */}
        <div className="w-[260px] bg-white rounded-md shadow-sm p-6 h-[520px] overflow-y-auto">
          <h2 className="text-2xl font-serif mb-6 border-b pb-3">Categories</h2>

          <ul className="space-y-5 text-lg font-serif">
            {categories.map((cat, i) => (
              <li key={i}>
                <Link
                  href={`categories${cat}`}
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

          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-md shadow-sm p-6 relative text-center hover:shadow-md transition"
            >
              {/* Discount */}
              <div className="absolute right-4 top-4 bg-teal-700 text-white text-sm px-3 py-1 rounded-md font-semibold">
                {product.discount}
              </div>

              {/* Brand */}
              <p className="text-sm text-gray-500 mb-4">Papyrus</p>

              {/* Image */}
              <div className="flex justify-center mb-6">
                <Image
                  src={product.img}
                  alt={product.name}
                  width={140}
                  height={140}
                  className="object-contain"
                />
              </div>

              {/* Name */}
              <Link href={`/product/${product.slug}`} className="font-serif text-xl font-semibold mb-4">
                {product.name}
              </Link>

              {/* Price */}
              <div className="flex justify-center gap-3 items-center">
                <span className="text-teal-700 font-semibold text-lg">
                  {product.price}
                </span>

                <span className="text-gray-400 line-through">
                  {product.oldPrice}
                </span>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
    </section>
        
  );
}