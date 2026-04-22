"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function BlogDetail(){

  const { id } = useParams()
  const [blog, setBlog] = useState(null)

  useEffect(() => {
    fetch("/api/blogs")
      .then(res => res.json())
      .then(data => {
        const found = data.find(b => b._id === id)
        setBlog(found)
      })
  }, [id])

  if (!blog) return <p>Loading...</p>

  return (

    <div className="max-w-4xl mx-auto py-12 px-6">

      <img src={blog.image} className="w-full rounded-xl mb-6" />

      <h1 className="text-3xl font-bold mb-4">
        {blog.title}
      </h1>

      <p className="text-gray-700 leading-7">
        {blog.content}
      </p>

    </div>
  )
}