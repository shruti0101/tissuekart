import React from "react";
import Image from "next/image";
import Link from "next/link";

const Whychoose = () => {
  const whychoose = [
    {
      id: 1,
      title: "Hygienic Standards",
      image: "/download.svg",
      desc: "Made in clean-room conditions and safely sealed. We use virgin pulp and non-toxic inks for a gentle, skin-safe touch.",
      bgColor: "#fdecef", // soft pink
    },

    {
      id: 2,
      title: "Everyday Variety",
      image: "/download1.svg",
      desc: "Made in clean-room conditions and safely sealed. We use virgin pulp and non-toxic inks for a gentle, skin-safe touch.",
      bgColor: "#f3ecff", // soft lavender
    },
    {
      id: 1,
      title: "Sustainable Sourcing",
      image: "/download2.svg",
      desc: "Made in clean-room conditions and safely sealed. We use virgin pulp and non-toxic inks for a gentle, skin-safe touch.",
      bgColor: "#e9f7ef", // soft mint
    },
    {
      id: 1,
      title: "Reliable Service",
      image: "/download3.svg",
      desc: "Made in clean-room conditions and safely sealed. We use virgin pulp and non-toxic inks for a gentle, skin-safe touch.",
      bgColor: "#fdf3e7", // soft peach
    },
  ];

  return (
    <div>
      <section className="w-full bg-[#EFEFEF] pt-4 pb-16">
        <div className=" mx-auto px-6">
          {/* Heading */}
          <h2 className="text-center font-serif text-4xl font-serif font-semibold text-black mb-10">
            Why Choose Us?
          </h2>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {whychoose.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center flex flex-col items-center"
              >
                {/* Icon Circle */}
                <div
                  className="w-15 h-15 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: item.bgColor }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={30}
                    height={30}
                  />
                </div>

                {/* Title */}
                <h3 className="text-lg font-serif font-semibold text-black mb-4">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-700 text-[14px] leading-relaxed max-w-xs">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-black mt-4 font-semibold font-serif text-4xl text-center">
          Our Process
        </h2>

        <div className="w-full">
          <Image
            src="/process.webp"
            alt="matrix"
            width={2000}
            height={1000}
            className="max-w-full h-auto object-cover"
          ></Image>
        </div>
      </section>

      {/* gift card */}

      <section className="bg-[#F3F1F0] py-12">
        <div className="max-w-7xl mx-auto px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="overflow-hidden rounded-xl">
              <Image
                src="/gift2.webp"
                alt="Gift hamper"
                width={600}
                height={600}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-full object-cover transition duration-500 hover:scale-105"
              />
            </div>

            <div className="overflow-hidden rounded-xl">
              <Image
                src="/gift1.webp"
                alt="Gift package"
                width={600}
                height={600}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-full object-cover transition duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* also availale on */}

      <section className="bg-white w-full py-13">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-serif font-semibold text-[#0f172a]">
            Also available on
          </h2>

          {/* Green underline accent */}
          <div className="flex justify-center mt-4 mb-6">
            <div className="w-40 h-1 bg-teal-600 rounded-full"></div>
          </div>

          {/* Subtitle with side lines */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="w-16 h-[2px] bg-teal-600"></div>
            <p className="text-lg font-serif text-gray-700">Quick Commerce</p>
          </div>

          {/* Logo Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {[
              "/brand/1.webp",
              "/brand/2.webp",
              "/brand/3.webp",
              "/brand/4.webp",
              "/brand/5.webp",
              "/brand/6.png",
            ].map((logo, i) => (
              <div
                key={i}
                className="border border-teal-600 rounded-xl p-6 flex items-center justify-center bg-white hover:shadow-md transition"
              >
                <img src={logo} alt="brand" className="max-h-16 object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* blogs */}

   

      <section className="w-full bg-white py-15">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Heading */}
          <h2 className="text-3xl    font-serif font-semibold text-[#0f172a] mb-3">
            Enjoy Exclusive Discounts
          </h2>

          {/* Subtitle */}
          <p className="text-lg  text-gray-600 font-serif leading-relaxed mb-8">
            Enjoy 5% off on your first purchase and be the first to know about
            offers, new releases, and latest stories.
          </p>

          {/* Form */}
          <form className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-[420px] h-14 px-5 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <button
              type="submit"
              className="h-14 px-10 bg-black text-white font-semibold tracking-wide rounded-md hover:opacity-90 transition"
            >
              SUBSCRIBE →
            </button>
          </form>

          {/* Note */}
          <p className="text-sm text-gray-500 font-serif">
            No spam, unsubscribe anytime!
          </p>
        </div>
      </section>
    </div>
  );
};

export default Whychoose;


  //  <section className="w-full bg-[#f5f1eb] py-10">
  //       <div className=" mx-auto px-8">
  //         {/* Header */}
  //         <div className="text-center mb-8">
  //           <h2 className="text-4xl font-serif font-semibold text-black mb-3">
  //             Our Blog
  //           </h2>
  //           <p className="text-md font-serif text-black">
  //             The Everyday Essential for Hygiene, Style, and Convenience
  //           </p>
  //         </div>

  //         {/* Blog Grid */}
  //         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
  //           {/* Card 1 */}
  //           <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
  //             <img
  //               src="/blog1.webp"
  //               alt="Face Tissue vs Handkerchief"
  //               className="w-full h-50 object-contain md:object-cover "
  //             />
  //             <div className="p-6">
  //               <h3 className="text-xl font-serif font-semibold mb-3">
  //                 Face Tissues vs. Handkerchiefs: Which One Is More Hygienic?
  //               </h3>
  //               <p className="text-gray-600 text-[15px] leading-relaxed">
  //                 There is one question that people usually ask: is it better to
  //                 use face tissues or handkerchiefs for personal hygiene?
  //               </p>
  //             </div>
  //           </div>

  //           {/* Card 2 */}
  //           <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
  //             <img
  //               src="/blog2.webp"
  //               alt="Tissue Napkins"
  //               className="w-full h-50 object-contain md:object-cover"
  //             />
  //             <div className="p-6">
  //               <h3 className="text-xl font-serif font-semibold mb-3">
  //                 Tissue Napkins: The Hygienic Dining Essential
  //               </h3>
  //               <p className="text-gray-600 text-[15px] leading-relaxed">
  //                 Cleanliness and presentation are the two most important
  //                 factors in every dining experience.
  //               </p>
  //             </div>
  //           </div>

  //           {/* Card 3 */}
  //           <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
  //             <img
  //               src="/blog3.webp"
  //               alt="Kitchen Towels Manufacturing"
  //               className="w-full h-50 object-contain md:object-cover"
  //             />
  //             <div className="p-6">
  //               <h3 className="text-xl font-serif font-semibold mb-3">
  //                 The Manufacturing Process of Kitchen Towels: From Pulp to
  //                 Perfection
  //               </h3>
  //               <p className="text-gray-600 text-[15px] leading-relaxed">
  //                 Behind every soft, absorbent kitchen towel lies an intricate
  //                 process that combines science, precision, and sustainability.
  //               </p>
  //             </div>
  //           </div>
  //         </div>

  //         <Link
  //           href="https://shop.tissuekart.com/blogs.php"
  //           className="flex justify-center items-center"
  //         >
  //           <button className="text-white cursor-pointer mt-7 rounded-sm bg-[#227873] uppercase py-3 px-6 text-md hover:bg-[#E6B70C] transition transform hover:scale-105">
  //             read more
  //           </button>
  //         </Link>
  //       </div>
  //     </section>