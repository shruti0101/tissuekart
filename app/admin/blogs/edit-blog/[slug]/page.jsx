"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import JoditEditor from "jodit-react";
import AdminPannel from "@/components/AdminPannel";
import { useRouter } from "next/navigation";

export default function Page() {
  const { slug } = useParams();
  const router = useRouter();

  const [blog, setBlog] = useState(null);
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        
        const res = await fetch(`/api/blogs/${slug}`);
        const data = await res.json();
        console.log(data);
        setBlog(data);
        setPreview(data?.image || null);
        setContent(data?.content || "");
      } catch (err) {
        console.log(err);
      }
    };

    if (slug) fetchBlog();
  }, [slug]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);

  const form = e.target;
  const formData = new FormData(form);

  // ✅ manually append Jodit content
  formData.set("content", content);

  try {
    const res = await fetch(`/api/blogs/${slug}`, {
      method: "PUT",
      body: formData, // ✅ send FormData
    });

    if (!res.ok) {
      alert("Update failed");
      return;
    }

    alert("Blog updated successfully");
    router.push("/admin/blogs");
    router.refresh();
  } catch (err) {
    console.log(err);
    alert("Something went wrong");
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="min-h-screen flex mt-36 bg-gray-100">
      <AdminPannel />

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white flex items-center justify-center shadow">
          <h1 className="text-2xl font-bold">Edit Blog ✍️</h1>
        </header>

        <main className="p-6">
          {!blog ? (
            <p className="text-center">Loading...</p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6"
            >
              {/* Title */}
              <div>
                <label className="block font-semibold mb-1">Title</label>
                <input
                  name="title"
                  defaultValue={blog.title}
                  className="w-full border rounded p-2"
                />
              </div>

              {/* Permalink */}
              <div>
                <label className="block font-semibold mb-1">Permalink</label>
                <input
                  name="slug"
                  defaultValue={blog.slug}
                  className="w-full border rounded p-2"
                />
              </div>

              {/* Meta Title */}
              <div>
                <label className="block font-semibold mb-1">Meta Title</label>
                <input
                  name="metaTitle"
                  defaultValue={blog.metaTitle}
                  className="w-full border rounded p-2"
                />
              </div>

              {/* Meta Description */}
              <div>
                <label className="block font-semibold mb-1">
                  Meta Description
                </label>
                <textarea
                  name="metaDescription"
                  defaultValue={blog.metaDescription}
                  className="w-full border rounded p-2 h-20"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block font-semibold mb-1">Content</label>
                <JoditEditor
                  value={content}
                  onChange={(newContent) => setContent(newContent)}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Publish Date</label>
                <input
                  type="date"
                  name="date"
                  defaultValue={
                    blog?.date
                      ? new Date(blog.date).toISOString().split("T")[0]
                      : ""
                  }
                  className="w-full border rounded p-2"
                />
              </div>

              {/* Image */}
              <div>
                <label className="block font-semibold mb-2">Thumbnail</label>
                <input
  type="file"
  name="image"   
  accept="image/*"
  onChange={handleImageChange}
  className="w-full border rounded p-2"
/>

                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    className="mt-3 w-56 h-36 object-cover rounded shadow"
                  />
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                  {saving ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
