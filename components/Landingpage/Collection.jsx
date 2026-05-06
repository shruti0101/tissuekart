"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css/pagination";
import PopupForm from "../Popup";

import Link from "next/link";

export default function CategorySection() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    {
      title: "Face Tissue",
      image: "/collection/1.webp",
      link: "/category/face-tissue",
    },

    {
      title: "Paper Napkin",
      image: "/collection/2.webp",
      link: "/category/paper-napkin",
    },

    {
      title: "Kitchen Towel",
      image: "/collection/3.webp",
      link: "/category/kitchen-towel",
    },

    {
      title: "Toilet Roll",
      image: "/collection/4.webp",
      link: "/category/toilet-roll",
    },

    {
      title: "Butter Paper Roll",
      image: "/collection/5.webp",
      link: "/category/butter-paper-roll",
    },
  ];

  const products = [
    {
      title: "Facial Tissue 100 Pulls",
      subtitle: "Facial Tissue",
      image: "/enquiry/1.webp",
      oldPrice: "₹356.00",
      price: "₹144.00",
    },
    {
      title: "Paper Napkin Silk Touch",
      subtitle: "Paper Napkin",
      image: "/enquiry/2.webp",
      oldPrice: "₹387.00",
      price: "₹128.00",
    },
    {
      title: "Kitchen Towel 4ply",
      subtitle: "Kitchen Towel",
      image: "/enquiry/3.webp",
      oldPrice: "₹249.00",
      price: "₹100.40",
    },
    {
      title: "Butter Paper Roll 1kg",
      subtitle: "Butter Paper Roll",
      image: "/enquiry/4.webp",
      oldPrice: "₹599.00",
      price: "₹289.00",
    },
  ];

  return (
    <>
      <div className="bg-[#F6F4F0]">
        <h2 className="capitalize  text-center text-black tracking-wide font-bold pt-8 text-3xl md:text-4xl">
          Trending collections
        </h2>

        <section className="max-w-[1400px] mx-auto px-2 md:px-6 py-10 relative">
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            loop
            autoplay={{ delay: 3500 }}
            spaceBetween={24}
            pagination={{ clickable: true }}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 3 },
            }}
            onSwiper={(swiper) => {
              setTimeout(() => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              });
            }}
          >
            {categories.map((slide) => (
              <SwiperSlide key={slide.id}>
                <Link href={slide.link}>
                  <div className="relative  rounded-xl overflow-hidden group">
                    <Image
                      width={700}
                      height={700}
                      src={slide.image}
                      alt={slide.title}
                      className="object-contain md:object-cover"
                    />
                    <div className="absolute inset-0  bg-black/10" />
                    <div className="absolute bottom-6 left-6 text-white z-10">
                      <button className="px-3 py-2 bg-teal-700 md:mt-2  cursor-pointer rounded-md capitalize hover:bg-yellow-500">
                        shop now
                      </button>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* ARROWS */}
          <button
            ref={prevRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 md:bg-white w-15 h-15 rounded-full shadow-lg flex items-center justify-center z-20"
          >
            <ChevronLeft size={25} className="text-teal-700" />
          </button>

          <button
            ref={nextRef}
            className="absolute right-0 top-1/2 -translate-y-1/2 md:bg-white w-15 h-15 rounded-full shadow-lg flex items-center justify-center z-20"
          >
            <ChevronRight size={25} className="text-teal-700" />
          </button>
        </section>
      </div>

      {/* Right Image */}

      <section   style={{backgroundImage:"url(/whychoose/bg.webp)"}} className="py-10 relative bg-cover bg-center">

       <div className=" relative max-w-7xl mx-auto overflow-hidden">

    

      {/* Optional overlay */}
      <div className="absolute inset-0 bg-white/10" />

      {/* CONTENT */}
      <div className="relative z-10 grid grid-cols-1  lg:grid-cols-2 md:gap-12 items-center">

  
       


        {/* LEFT CONTENT */}
        <div className="space-y-6 px-4 relative z-20">

          <h2 className="text-4xl font-bold lg:ml-4 text-gray-900">
            Why Choose Our Institutional Packs?
          </h2>

          <ul className="space-y-3">
            {[
              "Exclusive Design Options – Select premium designs that reflect your brand’s elegance.",
              "Tailored Product Range – Rolls aur tissue sizes aapke business requirement ke according.",
              "Eco-Conscious Manufacturing – Sustainably produced with hygiene and care.",
              "Elegant Presentation – Premium box design that enhances your brand’s impression.",
              "Assured Supply & Timely Delivery – Consistent quality with on-time fulfilment for every order.",
            ].map((item, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="mt-2 w-2 h-2 bg-[#00786f] rounded-full flex-shrink-0"></span>
                <span className="text-lg text-gray-800 font-medium">
                  {item}
                </span>
              </li>
            ))}
          </ul>

           <Link href="/shop" className="px-7 py-3 bg-[#00786f] rounded-lg text-white ">View More</Link>

        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex justify-center z-20">

      <Image alt="face tissues" width={700} height={500} className="max-w-full h-auto object-contain" src="/whychoose/whychoose.webp">

      </Image>

        </div>

      </div>
    </div>
      </section>


      <section className="w-full bg-[#efefef] py-4 ">
        <h2 className="capitalize font-bold text-center mb-8 text-xl md:text-4xl">
          bulk enquiry
        </h2>

        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col justify-between hover:scale-105 sm:hover:scale-105"
            >
              {/* IMAGE */}
              <div className="relative w-full mb-6 overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  width={1000}
                  height={800}
                  className="max-w-full h-auto object-cover"
                />
              </div>

              {/* TITLE */}
              <h3 className="font-semibold text-lg text-black">{p.title}</h3>

              {/* SUBTITLE */}
              <p className="text-gray-500 mt-1 mb-4">{p.subtitle}</p>

              {/* PRICE ROW */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex gap-3 items-center">
                  <span className="line-through text-gray-400 text-sm">
                    {p.oldPrice}
                  </span>
                  <span className="text-pink-600 font-semibold text-lg">
                    {p.price}
                  </span>
                </div>

                <button
                  onClick={() => setIsOpen(true)}
                  className="bg-[#1f7a6e] hover:bg-[#16635a] text-white px-6 py-2 rounded-full shadow-md whitespace-nowrap"
                >
                  Enquire Now
                </button>
              </div>

              {/* TAX LINE */}
              <p className="text-green-700 text-sm">✓ Inclusive of all taxes</p>
            </div>
          ))}
        </div>
      </section>

      <PopupForm onClose={() => setIsOpen(false)} isOpen={isOpen} />
    </>
  );
}
