"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const videos = [
  {
    id: "exhibition",
    src: "https://ik.imagekit.io/x2vr76hzx/site%20images/matrix%20video.mp4",
    label: "Exhibition Stalls",
  },
];

  const coupons = ["/1.webp", "/2.webp", "/3.webp", "/4.webp"]

export default function HeroVideo() {
  const [index] = useState(0);

  return (

    <>
    
    
  <section className="relative bg-[#F3F1F0] mt-16 md:mt-0 w-full h-[25vh] md:h-[70vh] xl:h-[120vh] overflow-hidden">

  <video
    key={videos[index].id}
    src={videos[index].src}
    autoPlay
    muted
    loop
    playsInline
    preload="metadata"
 
    className="w-full h-full object-cover"
  />

</section>


        {/* coupons */}
      <div className="bg-[#F3F1F0]">
        <section className="w-full py-5">
          <div className="w-full mx-auto  sm:px-7 grid grid-cols-4 sm:gap-8">
            {coupons.map((src, i) => (
              <div key={i} className="relative w-full ">
                <Image
                  src={src}
                  alt={`Coupon ${i}`}
                  width={500}
                  height={500}
                  className="max-w-full h-auto  object-contain md:object-cover hover:scale-95 transition"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </>

     
  );
}
