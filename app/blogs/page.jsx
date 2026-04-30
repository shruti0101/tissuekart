"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function BlogsPage() {

  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    fetch("/api/blogs")
      .then(res => res.json())
      .then(setBlogs)
  }, [])

  return (

    <div className="max-w-7xl mt-25 mx-auto py-12 ">

      <section className="relative h-[300px] flex items-center justify-center bg-[#0f756a]  text-white text-center">
        {/* Overlay */}

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-2">Our Blog</h1>
          <p className="text-lg">
            Insights on hygiene, sustainability, and modern living.
          </p>
        </div>
      </section>

      <section className="py-7 bg-gray-50">
      <div className="container mx-auto px-4 max-w-full">

        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Tissue Kart Blog
        </h1>

        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
          Explore hygiene, sustainability, and lifestyle insights with Tissue Kart.
          From tissue paper manufacturing to modern home essentials — discover how
          everyday products enhance comfort, hygiene, and convenience.
        </p>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {blogs.map((blog) => (
            <Link
              key={blog._id}
              href={`/blogs/${blog.slug}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 group"
            >
              {/* Image */}
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover rounded-md 
                group-hover:scale-[1.02] transition-transform duration-300"
              />

              {/* Title */}
              <h4 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-orange-500 transition">
                {blog.title}
              </h4>

              {/* Content (HTML safe render) */}
              <div
                className="text-gray-500 mt-2 text-sm line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html: blog.content || "<p>No description available</p>",
                }}
              />

              {/* Date */}
              <p className="text-sm text-gray-600 mt-3 flex items-center gap-2">
                📅{" "}
                {blog.date
                  ? new Date(blog.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "No date"}
              </p>
            </Link>
          ))}

        </div>
      </div>
    </section>

    </div>
  )
}