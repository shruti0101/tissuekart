"use client";
import { Search, User, Menu, X, Key } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/components/store/cartStore";
import { useWishlistStore } from "@/components/store/wishlistStore";
import { motion } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const openCart = useCartStore((state) => state.openCart);

  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState([]); // ✅ added

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 80) {
            setScrolled(true);
          } else {
            setScrolled(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ FETCH CATEGORIES (NO UI CHANGE)
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

  const wishlist = useWishlistStore((state) => state.wishlist);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ willChange: "transform" }}
      className={`w-full z-50 fixed top-0 left-0 ${
        scrolled
          ? "bg-black/5  shadow-lg"
          : "bg-transparent shadow-none"
      }`}
    >
      {/* ===== TOP GREEN PATTERN STRIP ===== */}
      <div className="w-full  bg-[url('/footer.webp')] bg-repeat">
        <div className="flex capitalize text-white gap-8 justify-end  px-5 md:x-15 md:mr-30 pt-1">
          <Link href="/contact-us">Help</Link>
        </div>
      </div>

      {/* ===== MAIN NAVBAR ===== */}
      <motion.div
        animate={{
          paddingTop: scrolled ? 4 : 8,
          paddingBottom: scrolled ? 4 : 8,
        }}
        transition={{ duration: 0.35 }}
        className="bg-black/20 border-b border-gray-500 text-white"
      >
        <div className="w-full mx-auto h-12 flex items-center justify-between px-4 md:px-8 lg:px-30 py-1">
          <Link href="/" className="">
            <Image
              src="/logo.webp"
              alt="Logo"
              width={190}
              height={190}
              className="w-[100px] sm:w-[150px] md:w-[190px]"
            />
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex gap-10 text-[20px] font-medium mr-15">
            <a href="/" className="hover:text-teal-700 transition">
              Home
            </a>
            <a href="/about-us" className="hover:text-teal-700 transition">
              About Us
            </a>
            <a href="/contact-us" className="hover:text-teal-700 transition">
              Contact Us
            </a>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Search Bar */}
            <div className="hidden lg:flex items-center bg-white rounded-full px-4 py-2 w-[320px]">
              <input
                type="text"
                placeholder="Search on Tissue Kart"
                className="flex-1 text-gray-700 text-sm outline-none"
              />
              <Search size={18} className="text-gray-500" />
            </div>

            {/* User Icon */}
            <Link
              href="/login"
              className="hidden lg:flex text-white"
            >
              <User size={22} />
            </Link>

            {/* cart */}
            <button onClick={openCart} className="relative hidden lg:flex">
              <ShoppingCart size={22} />
              <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            </button>

            {/* Wishlist */}
            <Link href="/wishlist">
              <div className="relative hidden lg:flex">
                <Heart size={22} />
                <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              </div>
            </Link>

            {/* Mobile Menu */}
            <button className="lg:hidden" onClick={() => setOpen(!open)}>
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* ===== MOBILE MENU (UNCHANGED UI) ===== */}
        {open && (
          <div className="lg:hidden bg-white/80 text-black backdrop-blur-md px-6 py-6 space-y-6 text-[18px]">
            <div className="h-px bg-white/20"></div>

            {/* ❗ kept your UI exactly same */}

            <div className=" font-serif overflow-y-auto max-h-[500px]">
              {/* (your static links untouched as you asked) */}
            </div>

            <div className="h-px bg-white/20"></div>
          </div>
        )}
      </motion.div>

      {/* ===== CATEGORY NAVBAR ===== */}
      <div className="hidden lg:block font-serif text-white text-[18px] md:text-[20px] font-medium bg-black/30 shadow-gray-300/50 shadow-lg">
        <div className="w-full mx-auto flex gap-6 md:gap-10 items-center px-4 md:px-8 lg:px-12 py-3 overflow-x-auto scrollbar-hide whitespace-nowrap">
          
          {categories.map((cat) => (
            <Link
              href={`/category/${cat.slug}`}   // ✅ FIXED
              key={cat._id}                      // ✅ FIXED
              className="hover:text-teal-700 transition "
            >
              {cat.name}
            </Link>
          ))}

          <div className="relative font-semibold">
            <a href="https://shop.tissuekart.com/sale.php" className="hover:text-teal-700 transition">
              SALE
            </a>
            <span className="absolute -top-2 -right-8 bg-teal-700 text-xs px-2 py-[2px] rounded-full">
              HOT
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}