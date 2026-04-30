"use client";
import AdminPannel from "@/components/AdminPannel";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function page() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [content, setContent] = useState("");
  const router = useRouter();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const form = e.currentTarget;

  const formData = new FormData();

  formData.append("title", form.title.value);
  formData.append("slug", form.permalink.value);
  formData.append("metaTitle", form.metaTitle.value);
  formData.append("metaDescription", form.metaDescription.value);
  formData.append("content", content);
  formData.append("date", form.date.value);

  
  const file = form.image.files[0];
  if (file) {
    formData.append("image", file);
  }

  try {
    const res = await fetch("/api/blogs", {
      method: "POST",
      body: formData, 
    });

    const result = await res.json();

    if (res.ok) {
      alert(result.msg || "Blog Created ✅");
      router.push("/admin/blogs");
    } else {
      alert(result.error || "Failed ❌");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong ⚠️");
  }

  setLoading(false);
};

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };
  return (
    <>
      <section className="mt-36 min-h-screen flex">
        <AdminPannel />

        <div className="flex-1 flex flex-col bg-[#020617] text-white">
          {/* Header */}
          <header
            className="h-16 flex items-center justify-center px-6 
                     border-b border-white/10 backdrop-blur-md bg-white/5"
          >
            <h1 className="text-2xl text-center font-semibold text-orange-400">
              Create Blog ✍️
            </h1>
          </header>

          {/* Form Section */}
          <main className="p-6">
            <form
              onSubmit={handleSubmit}
              className="max-w-3xl mx-auto 
                 bg-white/5 backdrop-blur-lg 
                 border border-white/10 
                 rounded-2xl p-6 space-y-6 
                 shadow-xl"
            >
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Title
                </label>
                <input
                  name="title"
                  placeholder="Enter blog title"
                  required
                  className="w-full bg-transparent border border-white/10 
                     rounded-lg p-2.5 text-white placeholder-gray-500
                     focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                />
              </div>

              {/* Permalink */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Permalink
                </label>
                <input
                  name="permalink"
                  placeholder="unique-url-slug"
                  required
                  className="w-full bg-transparent border border-white/10 
                     rounded-lg p-2.5 text-white placeholder-gray-500
                     focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                />
              </div>

              {/* Meta Title */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Meta Title
                </label>
                <input
                  name="metaTitle"
                  placeholder="SEO Meta Title"
                  className="w-full bg-transparent border border-white/10 
                     rounded-lg p-2.5 text-white placeholder-gray-500
                     focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                />
              </div>

              {/* Meta Description */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Meta Description
                </label>
                <textarea
                  name="metaDescription"
                  placeholder="Short SEO-friendly description"
                  className="w-full bg-transparent border border-white/10 
                     rounded-lg p-2.5 h-24 text-white placeholder-gray-500
                     focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-2 ">
                  Content
                </label>
                <div className="border text-black border-white/10 rounded-lg overflow-hidden">
                  <JoditEditor
                    value={content}
                    tabIndex={50}
                    onChange={(newContent) => setContent(newContent)}
                  />
                </div>
              </div>

              <div className="w-fit ">
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Publish Date
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full text-black bg-white border border-white/10 
      rounded-lg p-2.5  
      focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Thumbnail
                </label>

                <div
                  className="border-2 border-dashed border-white/10 w-fit
                        rounded-xl p-4 text-center hover:border-orange-400 transition"
                >
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-sm text-gray-400 cursor-pointer"
                  />
                </div>

                {preview && (
                  <div className="mt-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full max-w-xs h-40 object-cover 
                         rounded-lg border border-white/10 shadow-md"
                    />
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 
                     hover:from-orange-600 hover:to-orange-700
                     text-white font-semibold 
                     px-6 py-2.5 rounded-xl 
                     shadow-md hover:shadow-lg 
                     transition-all duration-300"
                >
                  {loading ? "Uploading… ⏳" : "Upload "}
                </button>
              </div>
            </form>
          </main>
        </div>
      </section>
    </>
  );
}
