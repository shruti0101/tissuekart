"use client";
import { Search, User, Menu, X, Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCartStore } from "@/components/store/cartStore";
import { useWishlistStore } from "@/components/store/wishlistStore";
import { motion } from "framer-motion";

export default function Navbar() {





const categoryImages = {
  "Face Tissue": "/catimg1.webp",
  "Paper Napkin": "/catimg-4.webp",
  "Kitchen Towel": "/catimg2.webp",
  "Toilet Roll": "/catimg5.webp",
  "Butter Paper Roll": "/catimg3.webp",
  "Cake Box": "catimg6.webp",
  "Bamboo Tissue": "/bamboot.webp",
};



  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [open, setOpen] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const openCart = useCartStore((state) => state.openCart);

  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState([]);

  const wishlist = useWishlistStore((state) => state.wishlist);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 80);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products?search=${query}`);
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-box")) {
        setShowResults(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`w-full z-50 fixed top-0 left-0 ${
        scrolled ? "bg-black/5 shadow-lg" : "bg-transparent"
      }`}
    >
      {/* TOP STRIP */}
      <div className="w-full bg-[url('/footer.webp')] bg-repeat">
        <div className="flex text-white gap-6 justify-end px-4 md:px-8 lg:px-15 text-sm">
          <Link href="/contact-us">Help</Link>
        </div>
      </div>

      {/* MAIN NAV */}
      <motion.div
        animate={{
          paddingTop: scrolled ? 8 : 8,
          paddingBottom: scrolled ? 8 : 8,
        }}
        className="bg-black/20 border-b  border-gray-500 text-white"
      >
        <div className="w-full flex items-center justify-between px-4 md:px-8 lg:px-30">

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-white"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* LOGO */}
          <Link href="/">
            <Image
              src="/logo.webp"
              alt="Logo"
              width={190}
              height={190}
              className="w-[90px] sm:w-[130px] md:w-[160px] lg:w-[190px] mr-30 md:mr-0"
              priority
            />
          </Link>

          {/* DESKTOP LINKS */}
          <nav className="hidden lg:flex gap-9 text-[20px] font-medium mr-10">
            <a href="/">Home</a>
            <a href="/about-us">About Us</a>
            <a href="/contact-us">Contact Us</a>
          </nav>

          {/* RIGHT */}
          <div className="flex gap-4 items-center">

            {/* SEARCH */}
            <div className="search-box relative hidden xl:flex items-center bg-white rounded-full px-4 py-2 w-[260px] xl:w-[320px]">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowResults(true);
                }}
                placeholder="Search on Tissue Kart"
                className="flex-1 text-gray-700 text-sm outline-none bg-transparent"
              />
              <Search size={18} className="text-gray-500" />

              {showResults && query && (
                <div className="absolute top-12 left-0 w-full bg-white shadow-xl rounded-xl max-h-[300px] overflow-y-auto z-50">
                  {loading ? (
                    <p className="p-4 text-sm text-gray-500">Searching...</p>
                  ) : results.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500">No products found</p>
                  ) : (
                    results.map((product) => (
                      <Link
                        key={product._id}
                        href={`/product/${product.slug}`}
                        className="flex items-center p-3 hover:bg-gray-100"
                        onClick={() => setShowResults(false)}
                      >
                        <p className="text-sm font-medium text-gray-800">
                          {product.name}
                        </p>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* ICONS */}
            <Link href="/login" className="flex">
              <User size={22} />
            </Link>

            <button onClick={openCart} className="relative flex">
              <ShoppingCart size={22} />
              <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            </button>

            <Link href="/wishlist" className="relative flex">
              <Heart size={22} />
              <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            </Link>
          </div>
        </div>

     {/* MOBILE MENU */}
{open && (
  <div className="lg:hidden bg-white/90 text-black backdrop-blur-md px-5 py-6 space-y-6 text-[16px] max-h-[85vh] overflow-y-auto">

  
   

    {/* CATEGORIES */}
    <div>

      <Link   onClick={() => setOpen(false)} className="pb-3" href="/">Home</Link>

    <hr className="py-3 opacity-25" />

      <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
        Categories
      </p>

    <div className="flex flex-col gap-3">
  {categories.map((cat) => (
    <Link
      key={cat._id}
      href={`/category/${cat.slug}`}
      onClick={() => setOpen(false)}
      className="flex items-center gap-3 p-1 rounded-lg hover:bg-gray-100 transition"
    >
      {/* Static Image */}
      <img
        src={categoryImages[cat.name] || "/placeholder.png"}
        alt={cat.name}
        className="w-15 h-15 object-cover"
      />

      {/* Name */}
      <span className="text-[20px] hover:text-teal-600 transition">
        {cat.name}
      </span>
    </Link>
  ))}
</div>
    </div>

    

    <div className="h-px bg-gray-300"></div>

    {/* SALE */}
    <div className="flex items-center justify-between">
      <a
        href="/sale"
        onClick={() => setOpen(false)}
        className="font-semibold text-[15px]"
      >
        SALE
      </a>
      <span className="bg-teal-600 text-white text-xs px-2 py-[2px] rounded-full">
        HOT
      </span>
    </div>
<div className="h-px bg-gray-300"></div>
      {/* SEARCH */}
    <div className="search-box flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="flex-1 text-gray-700 text-sm outline-none bg-transparent"
      />
      <Search size={18} className="text-gray-500" />
    </div>

  </div>
)}
      </motion.div>


        <div className="hidden lg:block text-white text-[16px] md:text-[18px] lg:text-[19px] font-bold bg-black/30 shadow-gray-300/50 shadow-lg">
        <div className="w-full mx-auto flex gap-6 md:gap-10 items-center justify-start lg:justify-center px-4 md:px-8 lg:px-12 py-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
          
          {categories.map((cat) => (
            <Link
              href={`/category/${cat.slug}`}
              key={cat._id}
              className="hover:text-teal-700 transition shrink-0"
            >
              {cat.name}
            </Link>
          ))}

          <div className="relative font-semibold shrink-0">
            <a href="/sale" className="hover:text-teal-700 transition">
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