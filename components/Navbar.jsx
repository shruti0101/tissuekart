"use client";
import { Search, User, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/components/store/cartStore";
import { useWishlistStore } from "@/components/store/wishlistStore";
import { motion } from "framer-motion";


export default function Navbar() {
// seach one
  const [query, setQuery] = useState("");
const [results, setResults] = useState([]);
const [loading, setLoading] = useState(false);
const [showResults, setShowResults] = useState(false);

  const [open, setOpen] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const openCart = useCartStore((state) => state.openCart);

  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState([]);

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
  }, 400); // debounce

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
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ willChange: "transform" }}
      className={`w-full z-50 fixed top-0 left-0 ${
        scrolled ? "bg-black/5 shadow-lg" : "bg-transparent shadow-none"
      }`}
    >
      {/* TOP STRIP */}
      <div className="w-full bg-[url('/footer.webp')] bg-repeat">
        <div className="flex capitalize text-white gap-6 sm:gap-8 justify-end px-4 md:px-8 lg:px-15  text-sm sm:text-base">
          <Link href="/contact-us">Help</Link>
        </div>
      </div>

      {/* MAIN NAV */}
      <motion.div
        animate={{
          paddingTop: scrolled ? 4 : 8,
          paddingBottom: scrolled ? 4 : 8,
        }}
        transition={{ duration: 0.35 }}
        className="bg-black/20 border-b border-gray-500 text-white"
      >
        <div className="w-full mx-auto flex items-center justify-between px-4 md:px-8 lg:px-30 ">

          {/* LOGO */}
          <Link href="/">
            <Image
              src="/logo.webp"
              alt="Logo"
              width={190}
              height={190}
              className="w-[90px] sm:w-[130px] md:w-[160px] lg:w-[190px] h-auto"
              priority
            />
          </Link>

          {/* DESKTOP LINKS */}
          <nav className="hidden lg:flex gap-10 text-[20px] font-medium mr-15">
            <a href="/" className="hover:text-teal-700 transition">Home</a>
            <a href="/about-us" className="hover:text-teal-700 transition">About Us</a>
            <a href="/contact-us" className="hover:text-teal-700 transition">Contact Us</a>
          </nav>

          {/* RIGHT */}
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
          className="flex items-center gap-3 p-3 hover:bg-gray-100 transition"
          onClick={() => setShowResults(false)}
        >
          <Image
            src={product.image}
            alt={product.name}
            width={40}
            height={40}
            className="rounded-md"
          />
          <div>
            <p className="text-sm font-medium text-gray-800">
              {product.name}
            </p>
            <p className="text-xs text-gray-500">
              ₹{product.price}
            </p>
          </div>
        </Link>
      ))
    )}
  </div>
)}
</div>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="lg:hidden bg-white/80 text-black backdrop-blur-md px-6 py-6 space-y-6 text-[18px] max-h-[80vh] overflow-y-auto">
            <div className="h-px bg-white/20"></div>

            <div className="overflow-y-auto max-h-[500px]"></div>

            <div className="h-px bg-white/20"></div>
          </div>
        )}
      </motion.div>

      {/* CATEGORY NAV */}
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