"use client"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from "swiper/modules"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef } from "react"
import Link from "next/link"

import "swiper/css"

export default function Slider() {
  const prevRef = useRef(null)
  const nextRef = useRef(null)

  const slides = [
    { id: 1, image: "/slider/1.webp", title: "Paper Napkins", subtitle: "Matrix Tissues", link: "/product/print-paper-napkins" },

    { id: 6, image: "/slider/2.webp", title: "Cling Film", subtitle: "Matrix Tissues", link: "/product/cling-film-30m" },

    { id: 2, image: "/slider/3.webp", title: "Toilet Roll", subtitle: "Matrix Tissues", link: "/product/toilet-roll-12x1-3-ply" },

    { id: 3, image: "/slider/4.webp", title: "Cling Film", subtitle: "Matrix Tissues", link: "/product/papyrus-paper-napkin-silk-touch" },

    { id: 4, image: "/slider/5.webp", title: "Cling Film", subtitle: "Matrix Tissues", link: "/product/cling-film-30m" },
    { id: 5, image: "/slider/6.webp", title: "Cling Film", subtitle: "Matrix Tissues", link: "/product/kitchen-towel-4ply" },
  ]



  return (
    <>
  

      {/* SLIDER */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 relative overflow-hidden">
        <Swiper
          modules={[Navigation, Autoplay]}
          loop
          autoplay={{ delay: 3500 }}
          spaceBetween={24}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 3 },
          }}
          onSwiper={(swiper) => {
            setTimeout(() => {
              if (!prevRef.current || !nextRef.current) return
              swiper.params.navigation.prevEl = prevRef.current
              swiper.params.navigation.nextEl = nextRef.current
              swiper.navigation.init()
              swiper.navigation.update()
            })
          }}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <Link href={slide.link}>
                <div className="relative rounded-xl overflow-hidden group">
                  <Image
                    src={slide.image}
                 width={500}
                 height={500}
                 alt=""
                    className="object-contain lg:object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-6 left-6 text-white z-10">
                    <h3 className="text-2xl font-bold">{slide.title}</h3>
                    <p >{slide.subtitle}</p>
                    <button className="px-3 py-2 bg-teal-700 mt-2 rounded-md capitalize hover:bg-yellow-500">
                      shop now
                    </button>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ARROWS (hidden only on very small screens) */}
        <button
          ref={prevRef}
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white w-15 h-15 rounded-full shadow-lg items-center justify-center z-20"
        >
          <ChevronLeft size={25} className="text-teal-700" />
        </button>

        <button
          ref={nextRef}
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white w-15 h-15 rounded-full shadow-lg items-center justify-center z-20"
        >
          <ChevronRight size={25} className="text-teal-700" />
        </button>
      </section>

      {/* GIF */}
      <section>
        <div className="w-full">
          <Image
            src="/matrix.gif"
            alt="matrix"
            width={2000}
            height={1000}
            className="max-w-full h-auto object-cover"
          />
        </div>
      </section>
    </>
  )
}
