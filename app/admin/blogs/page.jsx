"use client";
import AdminPannel from "@/components/AdminPannel";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function page() {
  const [blogs, setBlog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((d) => {
        setBlog(d);
        setLoading(false);
        console.log(blogs);
      });
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch("/api/blogs", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        alert("Some issue in deleting this blog");
        return;
      }

      setBlog((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.log(err);
      alert("Error deleting blog");
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-[#0F172A] text-white mt-36">
        {/* SIDEBAR */}
        <AdminPannel />

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 md:p-10">
          <h2 className="text-3xl font-bold text-center mb-6">Manage Blogs</h2>

          {loading ? (
            <div className="flex justify-center items-center h-[60vh]">
              <p className="text-orange-400 text-lg animate-pulse">
                Loading blogs...
              </p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <p className="text-gray-400 text-lg mb-3">No blogs Posted</p>

              <Link
                href="/admin/blogs/newblog"
                className="bg-orange-500 hover:bg-orange-600 
                 px-4 py-2 rounded-lg text-white text-sm 
                 transition"
              >
                + Create Your First Blog
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  onClick={() => console.log(blog)}
                  className="group bg-[#020617] border border-white/10 rounded-2xl overflow-hidden
  hover:shadow-xl hover:border-orange-500/30 
  transition-all duration-300 cursor-pointer"
                >
                  {/* IMAGE */}
                  {blog.image && (
                    <div className="w-full h-48 overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-5">
                    {/* TITLE */}
                    <h3 className="text-lg font-semibold text-orange-400 mb-2">
                      {blog.title}
                    </h3>
s
                    {/* DESCRIPTION */}
                    <p
                      className="text-gray-400 text-sm mb-3  line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: blog.content || "No description available",
                      }}
                    />

                    {/* DATE */}
                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      📅{" "}
                      {blog.date
                        ? new Date(blog.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "No date"}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-between items-center pt-3 border-t border-white/10">
                      {/* EDIT */}
                      <Link
                        href={`/admin/blogs/edit-blog/${blog.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-400 text-sm hover:underline"
                      >
                        Edit
                      </Link>

                      {/* DELETE */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(blog._id);
                        }}
                        className="text-red-400 text-sm hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
