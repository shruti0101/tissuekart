"use client"
import Image from "next/image"
import CountUp from "react-countup"
import Link from "next/link"
export default function CategorySection() {

  const categories = [
    { title: "Face Tissue", image: "/cat/1.webp", link:"https://shop.tissuekart.com/category.php?slug=face-tissue"},

    { title: "Paper Napkin", image: "/cat/2.webp" ,link:"https://shop.tissuekart.com/category.php?slug=paper-napkin"},

    { title: "Kitchen Towel", image: "/cat/3.webp",link:"https://shop.tissuekart.com/category.php?slug=kitchen-towel" },
    { title: "Toilet Roll", image: "/cat/4.webp",link:"https://shop.tissuekart.com/category.php?slug=toilet-roll" },

    { title: "Butter Paper Roll", image: "/cat/5.webp" ,link:"https://shop.tissuekart.com/category.php?slug=butter-paper-roll"},

    { title: "Cake Box", image: "/cat/6.webp", link:"https://shop.tissuekart.com/category.php?slug=cake-box" },
  ]

  return (
    <>
      <div className="bg-[#F6F4F0]">

        {/* CATEGORY GRID */}
        <section className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((item, i) => (
              <Link
                href={item.link}
                key={i}
                className="relative h-[140px] md:h-[260px] rounded-2xl overflow-hidden group cursor-pointer"
              >
                {/* IMAGE */}
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />

                {/* DARK OVERLAY */}
                <div className="absolute inset-0 bg-black/25 transition" />

                {/* TITLE */}
                <div className="absolute bottom-4 w-full text-center text-white z-10">
                  <h3 className="text-xl md:text-2xl font-semibold drop-shadow-lg">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* BUTTON */}
        <Link href="https://shop.tissuekart.com/shop.php" className="flex justify-center items-center py-4">
          <button className="px-4 text-md py-3 bg-teal-700 mt-2 text-white cursor-pointer rounded-md capitalize hover:bg-yellow-500">
            explore categories
          </button>
        </Link>

      </div>

      {/* COUNT UP SECTION */}
      <section
        className="w-full py-14 text-white bg-contain lg:bg-cover bg-center bg-fixed "
        style={{
      backgroundImage:"url(/footer.webp)"

        }}
      >
        <div className="max-w-[1400px]  mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          <Stat number={30} suffix="+" label="YEARS OF MANUFACTURING" />
          <Stat number={150} suffix="+" label="CITIES COVERED" />
          <Stat number={200} suffix="+" label="DISTRIBUTORS ACROSS INDIA" />
          <Stat number={25} suffix="+" label="STATES SERVED" />
        </div>
      </section>
    </>
  )
}

/* STAT COMPONENT */
function Stat({ number, suffix, label }) {
  return (
    <div>
      <h3 className="text-4xl md:text-5xl font-bold mb-2">
        <CountUp end={number} duration={2.5} suffix={suffix} />
      </h3>
      <p className="text-sm tracking-widest opacity-90">
        {label}
      </p>
    </div>
  )
}
