"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Categories() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
const [metaTitle, setMetaTitle] = useState("");
const [metaDescription, setMetaDescription] = useState("");
  // ✅ Fetch categories
  useEffect(() => {
    refreshCategories();
  }, []);

  const refreshCategories = () => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  };

  // ✅ Add + Update
  const handleSubmit = async () => {
    if (!name) return toast.error("Enter category name");

    const toastId = toast.loading(
      editingId ? "Updating..." : "Adding..."
    );

    const payload = {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
        metaTitle,
  metaDescription,
    };

    if (editingId) {
      // 🔥 UPDATE
      await fetch("/api/categories", {
        method: "PUT",
        body: JSON.stringify({ ...payload, _id: editingId }),
      });
      toast.success("Category updated", { id: toastId });
    } else {
      // 🔥 CREATE
      await fetch("/api/categories", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      toast.success("Category added", { id: toastId });
    }

    resetForm();
    refreshCategories();
  };

  // 🔄 Reset
  const resetForm = () => {
    setName("");
      setMetaTitle("");
  setMetaDescription("");
    setEditingId(null);
  };

  // ✏️ Edit
  const handleEdit = (c) => {
    setEditingId(c._id);
    setName(c.name);
      setMetaTitle(c.metaTitle || "");
  setMetaDescription(c.metaDescription || "");
  };

  // ❌ Delete
  const handleDelete = async (id) => {
    const toastId = toast.loading("Deleting...");

    await fetch(`/api/categories?id=${id}`, {
      method: "DELETE",
    });

    setCategories((prev) => prev.filter((c) => c._id !== id));

    toast.success("Deleted", { id: toastId });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <h1 className="text-2xl font-semibold mb-6">
        {editingId ? "Edit Category" : "Add Category"}
      </h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow-sm max-w-md">

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />


<input
  className="w-full border p-2 rounded mb-3"
  placeholder="Meta Title"
  value={metaTitle}
  onChange={(e) => setMetaTitle(e.target.value)}
/>

<textarea
  className="w-full border p-2 rounded mb-3"
  placeholder="Meta Description"
  value={metaDescription}
  onChange={(e) => setMetaDescription(e.target.value)}
/>


        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-black text-white py-2 rounded"
          >
            {editingId ? "Update" : "Add"}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              className="flex-1 bg-gray-200 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* LIST */}
      <h2 className="text-lg font-semibold mt-8 mb-3">
        All Categories
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((c) => (
          <div
            key={c._id}
            className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center"
          >
            <span className="text-sm">{c.name}</span>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(c)}
                className="text-blue-500 text-xs"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(c._id)}
                className="text-red-500 text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}