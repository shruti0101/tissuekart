"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCartStore } from "@/components/store/cartStore";
export default function Home() {
  // ✅ Testimonials
  const testimonials = [
    {
      name: "Ritika Sharma",
      city: "Delhi",
      text: "Excellent quality tissues! The texture is super soft yet durable.",
      rating: 5,
    },
    {
      name: "Ankit Mehra",
      city: "Mumbai",
      text: "Bulk order arrived on time. Great service!",
      rating: 5,
    },
    {
      name: "Sneha Kapoor",
      city: "Pune",
      text: "Eco-friendly and premium feel. Highly recommended!",
      rating: 5,
    },
    {
      name: "Neha Arora",
      city: "Gurgaon",
      text: "Luxury tissues are perfect for office & home.",
      rating: 5,
    },
  ];

const addToCart = useCartStore((state) => state.addToCart);

  const [index, setIndex] = useState(0);

  const nextSlide = () =>
    setIndex((prev) => (prev + 1) % testimonials.length);

  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  // ✅ FIXED auto slide
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Products
  const products = [
    {
      name: "Face Tissue Silk/Vintage",
      category: "Facial Tissue",
      oldPrice: 356,
      price: 144,
      image: "/upload/ftv.webp",
    },
    {
      name: "Papyrus Paper Napkin Silk Touch",
      category: "Paper Napkin",
      oldPrice: 387,
      price: 128,
      image: "/upload/Silky.webp",
    },
    {
      name: "Kitchen Towel 4ply",
      category: "Kitchen Towel",
      oldPrice: 398,
      price: 200,
      image: "/upload/kitchen-towel-4ply.webp",
    },
    {
      name: "Butter Paper Roll 1kg",
      category: "Butter Paper",
      oldPrice: 599,
      price: 289,
      image: "/upload/butterpaper2.webp",
    },

     {
      name: "Papyrus Paper Napkin Silk Touch",
      category: "Paper Napkin",
      oldPrice: 387,
      price: 128,
      image: "/upload/Silky.webp",
    },
    {
      name: "Kitchen Towel 4ply",
      category: "Kitchen Towel",
      oldPrice: 398,
      price: 200,
      image: "/upload/kitchen-towel-4ply.webp",
    },
    {
      name: "Butter Paper Roll 1kg",
      category: "Butter Paper",
      oldPrice: 599,
      price: 289,
      image: "/upload/butterpaper2.webp",
    },
        {
      name: "Butter Paper Roll 1kg",
      category: "Butter Paper",
      oldPrice: 599,
      price: 289,
      image: "/upload/butterpaper2.webp",
    },
  ];

  return (
    <div className="bg-[#f3f1f0]  mt-15 md:mt-0">

      {/* ✅ Banner */}
      <div className="relative w-full h-[25vh] md:h-[70vh] lg:h-screen">
        <Link href="/shop">
        
        <Image
          src="/salebanner.png"
          width={1400}
          height={1000}
          alt="Banner"
          className="max-w-full h-auto md:h-full md:w-full object-cover"
        />
        </Link>
      </div>

      {/* ✅ Products */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-10">
            Grab the Best Deals Before They’re Gone!
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((product, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4"
              >
                {/* Image */}
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Info */}
                <h3 className="font-semibold text-gray-800">
                  {product.name}
                </h3>

                <p className="text-gray-500 text-sm mb-2">
                  {product.category}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="line-through text-gray-400 text-sm mr-1">
                      ₹{product.oldPrice}
                    </span>
                    <span className="text-red-600 font-bold">
                      ₹{product.price}
                    </span>
                  </div>

                  <button        onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, 1);
                    }} className="bg-[#1b7677] text-white px-4 py-2 rounded-full text-sm hover:bg-[#e7b70b]">
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Testimonials */}
      <section className="py-20 bg-gradient-to-br from-white to-gray-100">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-5xl font-extrabold text-center text-[#c41e3a] mb-16">
            What They're Saying
          </h2>

          <div className="relative">

            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-2xl p-10 md:p-14 text-center max-w-3xl mx-auto"
              >

                {/* Stars */}
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[index].rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-lg md:text-xl text-gray-700 mb-8">
                  “{testimonials[index].text}”
                </p>

                {/* User */}
                <h4 className="text-xl font-bold">
                  {testimonials[index].name}
                </h4>
                <p className="text-gray-500 text-sm">
                  {testimonials[index].city}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-3 rounded-full hover:bg-[#c41e3a] hover:text-white"
            >
              <ChevronLeft />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-3 rounded-full hover:bg-[#c41e3a] hover:text-white"
            >
              <ChevronRight />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-3 rounded-full transition ${
                  i === index ? "bg-[#c41e3a] w-6" : "bg-gray-300 w-3"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}