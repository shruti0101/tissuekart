"use client"
import { Search, User, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState,useEffect } from "react"
import {  Heart, ShoppingCart } from "lucide-react"
import { useCartStore } from "@/components/store/cartStore"
import { useWishlistStore } from "@/components/store/wishlistStore"
import { motion } from "framer-motion"
export default function Navbar() {
  const [open, setOpen] = useState(false)
const cart = useCartStore((state) => state.cart)
const openCart = useCartStore((state) => state.openCart)

const [scrolled, setScrolled] = useState(false)

useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 80) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }
  }

  window.addEventListener("scroll", handleScroll)
  return () => window.removeEventListener("scroll", handleScroll)
}, [])





const wishlist = useWishlistStore((state) => state.wishlist)



  return (
 <motion.header
  initial={{ y: -80, opacity: 0 }}
  animate={{
    y: 0,
    opacity: 1
  }}
  transition={{ duration: 0.45, ease: "easeOut" }}
  className={`w-full z-50 ${
    scrolled
      ? "fixed top-0 left-0 bg-black/20 backdrop-blur-xs shadow-lg"
      : "relative"
  }`}
>
      
      {/* ===== TOP GREEN PATTERN STRIP ===== */}
      <div className="w-full  bg-[url('/footer.webp')] bg-repeat">
      <div className="flex capitalize text-white gap-8 justify-end  px-5 md:x-15 md:mr-30 pt-1">
        <Link href="/contact-us" >Help</Link>
        <Link href="https://shop.tissuekart.com/admin/login.php" className="block md:hidden">Login</Link>
      </div>
      
      </div>

      {/* ===== MAIN NAVBAR ===== */}
<motion.div
  animate={{
    paddingTop: scrolled ? 4 : 8,
    paddingBottom: scrolled ? 4 : 8
  }}
  transition={{ duration: 0.35 }}
  className="bg-black/20 border-b border-black text-white"
>
        <div className="w-full mx-auto flex items-center justify-between px-4 md:px-8 lg:px-30 py-1">
          
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
            <a href="/" className="hover:text-teal-700 transition">Home</a>
            <a href="/about-us" className="hover:text-teal-700 transition">About Us</a>
            <a href="/contact-us" className="hover:text-teal-700 transition">Contact Us</a>
          </nav>

          {/* Right Section */}
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
    href="https://shop.tissuekart.com/admin/login.php"
    className="hidden lg:flex text-white"
  >
    <User size={22} />
  </Link>

 

{/* cart */}
 <button onClick={openCart} className="relative hidden lg:flex">
    <ShoppingCart size={22} />
    <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
      ({cart.length})
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
  <button
    className="lg:hidden"
    onClick={() => setOpen(!open)}
  >
    {open ? <X size={26} /> : <Menu size={26} />}
  </button>

</div>
        </div>

        {/* ===== MOBILE MENU ===== */}
      {/* ===== MOBILE MENU ===== */}
{open && (
  <div className="lg:hidden bg-white/80  text-black backdrop-blur-md px-6 py-6 space-y-6 text-[18px]">

  

    {/* Divider */}
    <div className="h-px bg-white/20"></div>

    {/* Categories */}
  {/* Categories */}
<div className=" font-serif overflow-y-auto max-h-[500px]">

  {/* Face Tissue */}
  <Link
    href="https://shop.tissuekart.com/category.php?slug=face-tissue"
    className="flex items-center gap-3 hover:text-teal-700 py-2"
  >
    <Image src="/catimg1.webp" alt="" width={68} height={58}/>
    Face Tissue
  </Link>

  {/* Paper Napkin */}
  <Link
    href="https://shop.tissuekart.com/category.php?slug=paper-napkin"
    className="flex items-center gap-1 hover:text-teal-700 py-2"
  >
    <Image src="/catimg4.png" alt="" width={78} height={68}/>
    Paper Napkin
  </Link>

  {/* Kitchen Towel */}
  <Link
    href="https://shop.tissuekart.com/category.php?slug=kitchen-towel"
    className="flex items-center gap-3 hover:text-teal-700 py-2"
  >
    <Image src="/catimg2.webp" alt="" width={68} height={58}/>
    Kitchen Towel
  </Link>

  {/* Toilet Roll */}
  <Link
    href="https://shop.tissuekart.com/category.php?slug=toilet-roll"
    className="flex items-center gap-3 hover:text-teal-700 py-2"
  >
    <Image src="/catimg5.webp" alt="" width={68} height={58}/>
    Toilet Roll
  </Link>

  {/* Butter Paper */}
  <Link
    href="https://shop.tissuekart.com/category.php?slug=butter-paper-roll"
    className="flex items-center gap-3 hover:text-teal-700 py-2"
  >
    <Image src="/catimg3.webp" alt="" width={68} height={58}/>
    Butter Paper Roll
  </Link>

  {/* Cake Box */}
  <Link
    href="https://shop.tissuekart.com/category.php?slug=cake-box"
    className="flex items-center gap-2 hover:text-teal-700 py-2"
  >
    <Image src="/catimg6.png" alt="" width={78} height={68}/>
    Cake Box
  </Link>

  {/* Bamboo Soon */}
  <div className="flex items-center gap-3 opacity-60 py-2">

    Bamboo Tissue (Available Soon)
  </div>

  {/* SALE */}
  <Link
    href="https://shop.tissuekart.com/sale.php"
    className="flex items-center justify-between hover:text-teal-700 py-2 font-semibold"
  >
    <div className="flex items-center gap-3 animate-pulse">
  
      SALE
    </div>

    <span className="bg-teal-700 text-white text-xs px-2 py-[2px] animate-pulse rounded-full">
      HOT
    </span>
  </Link>

</div>

    {/* Divider */}
    <div className="h-px bg-white/20"></div>

    {/* Mobile Search */}
    {/* <div className="flex items-center bg-white rounded-md overflow-hidden">
      <input
        type="text"
        placeholder="Search on Tissue Kart"
        className="px-4 py-2 w-full text-sm text-gray-700 outline-none"
      />
      <button className="px-3 text-gray-500">
        <Search size={18} />
      </button>
    </div> */}

  </div>
)}

      </motion.div>

      {/* ===== CATEGORY NAVBAR ===== */}
      <div className="hidden lg:block font-serif text-white text-[18px] md:text-[20px] font-medium bg-black/30 shadow-gray-300/50 shadow-lg">
        <div className="w-full mx-auto flex gap-6 md:gap-10 items-center px-4 md:px-8 lg:px-12 py-3 overflow-x-auto scrollbar-hide whitespace-nowrap">
          
          <a href="/categories/" className="hover:text-teal-700 transition">Face Tissue</a>
          <a href="/categories/" className="hover:text-teal-700 transition">Paper Napkin</a>
          <a href="/categories/" className="hover:text-teal-700 transition">Kitchen Towel</a>
          <a href="/categories/" className="hover:text-teal-700 transition">Toilet Roll</a>
          <a href="/categories/" className="hover:text-teal-700 transition">Butter Paper Roll</a>
          <a href="/categories/" className="hover:text-teal-700 transition">Cake Box</a>

          <a href="#" className="hover:text-teal-700 transition">
            Bamboo Tissue <span className="opacity-80">(Available Soon)</span>
          </a>

          <div className="relative font-semibold">
            <a href="https://shop.tissuekart.com/sale.php" className="hover:text-teal-700 transition">SALE</a>
            <span className="absolute -top-2 -right-8 bg-teal-700 text-xs px-2 py-[2px] rounded-full">
              HOT
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
