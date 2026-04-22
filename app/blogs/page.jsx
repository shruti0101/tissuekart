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

    <div className="max-w-7xl mx-auto py-12 px-6">

      <h1 className="text-3xl font-semibold mb-10">
        Latest Blogs
      </h1>

      <div className="grid md:grid-cols-3 gap-8">

        {blogs.map(blog => (

          <Link
            key={blog._id}
            href={`/blogs/${blog._id}`}
            className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition"
          >

            <img src={blog.image} className="h-48 w-full object-cover" />

            <div className="p-5">

              <h2 className="text-lg font-semibold mb-2">
                {blog.title}
              </h2>

              <p className="text-gray-500 text-sm line-clamp-2">
                {blog.content}
              </p>

            </div>

          </Link>

        ))}

      </div>

    </div>
  )
}