"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function BlogDetail() {
  const { slug } = useParams();
//   console.log(slug);
  const [blog, setBlog] = useState(null);

  useEffect(() => {
  if (!slug) return;

  fetch(`/api/blogs/${slug}`)
    .then((res) => res.json())
    .then((data) => {
    //   console.log(data);
      setBlog(data);
    })
    .catch((err) => console.error(err));
}, [slug]);

  if (!blog)
    return (
      <p className="text-center py-20 text-gray-500">Loading...</p>
    );

  return (
    <section className="py-16 mt-25 bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl bg-white rounded-2xl shadow-md p-8">

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 text-center">
          {blog.title}
        </h1>

        {/* Image */}
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="rounded-lg mb-6 w-full shadow-sm"
          />
        )}

        {/* Meta */}
        <p className="text-sm text-gray-500 mb-8 text-center">
          <span>By </span> |{" "}
          <span>
            {blog.date
              ? new Date(blog.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "No date"}
          </span>
        </p>

        {/* Content (IMPORTANT FIX) */}
        <div
          className="prose max-w-none blog-content"
          dangerouslySetInnerHTML={{
            __html: blog.content || "<p>No content available</p>",
          }}
        ></div>

      </div>
    </section>
  );
}