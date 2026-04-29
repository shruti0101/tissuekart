"use client";

import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import JoditEditor from "jodit-react";

export default function ProductList() {

  const editor = useRef(null);

  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetch("/api/categories").then(res => res.json()).then(setCategories);
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  // ✅ DELETE
const handleDelete = async (id) => {
  const toastId = toast.loading("Deleting...");

  const token = localStorage.getItem("token");



  if (!token) {
    toast.error("User not logged in ❌", { id: toastId });
    return;
  }

  try {
    const res = await fetch(`/api/products/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ IMPORTANT
      },
    });

    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      toast.error(data.msg || "Delete failed ❌", { id: toastId });
      return;
    }

    setProducts((prev) => prev.filter((p) => p._id !== id));

    toast.success("Deleted ✅", { id: toastId });

  } catch (err) {
    console.error(err);
    toast.error("Something went wrong ❌", { id: toastId });
  }
};

  // ✅ IMAGE UPLOAD
  const uploadImages = async (files) => {
    setUploading(true);
    const toastId = toast.loading("Uploading...");

    let urls = [];

    for (let file of files) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET);

    
      data.append("folder", "Tissuekartproducts");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );

      const result = await res.json();
      urls.push(result.secure_url);
    }

    setEditing((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...urls],
    }));

    setUploading(false);
    toast.success("Uploaded", { id: toastId });
  };

  // ✅ SPEC FUNCTIONS
  const addSpec = () => {
    setEditing({
      ...editing,
      specifications: [...(editing.specifications || []), { key: "", value: "" }],
    });
  };

  const updateSpec = (i, field, value) => {
    const updated = [...editing.specifications];
    updated[i][field] = value;
    setEditing({ ...editing, specifications: updated });
  };

  const removeSpec = (i) => {
    setEditing({
      ...editing,
      specifications: editing.specifications.filter((_, idx) => idx !== i),
    });
  };

  //  UPDATE
const handleUpdate = async () => {
  const toastId = toast.loading("Updating...");
  const token = localStorage.getItem("token");

  try {
    const payload = {
      ...editing,
      category:
        typeof editing.category === "object"
          ? editing.category._id
          : editing.category, // ✅ FIX
    };

    const res = await fetch(`/api/products/update/${editing._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.msg || "Update failed ❌", { id: toastId });
      return;
    }

    setEditing(null);
    fetchProducts();

    toast.success("Updated ✅", { id: toastId });
  } catch (err) {
    console.error(err);
    toast.error("Error updating ❌", { id: toastId });
  }
};

  return (
    <div className="p-8 bg-[#F6F7FB] min-h-screen mt-10 md:mt-35">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-4xl font-semibold">All Products</h1>

        {editing && (
          <button
            onClick={() => setEditing(null)}
            className="bg-gray-200 px-4 py-2 rounded-lg"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* 🔥 EDIT MODE (FULL FORM) */}
      {editing && (
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          {/* LEFT */}
          <div className="md:col-span-2 space-y-6">

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="mb-4 font-semibold">Basic Info</h2>

              <input
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
                className="w-full border p-3 rounded-lg mb-3"
                placeholder="Name"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  value={editing.price}
                  onChange={(e) =>
                    setEditing({ ...editing, price: e.target.value })
                  }
                  className="border p-3 rounded-lg"
                  placeholder="Price"
                />
                <input
                  value={editing.oldPrice || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, oldPrice: e.target.value })
                  }
                  className="border p-3 rounded-lg"
                  placeholder="Old Price"
                />
              </div>

              <select
                value={editing.category}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value })
                }
                className="w-full border p-3 rounded-lg mt-3"
              >
                <option>Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <textarea
                value={editing.description || ""}
                onChange={(e) =>
                  setEditing({ ...editing, description: e.target.value })
                }
                className="w-full border p-3 rounded-lg mb-3"
                placeholder="Short Description"
              />

              <textarea
                value={editing.features?.join(",") || ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    features: e.target.value.split(","),
                  })
                }
                className="w-full border p-3 rounded-lg mb-3"
                placeholder="Features"
              />

              <JoditEditor
                ref={editor}
                value={editing.longdescription || ""}
                onChange={(val) =>
                  setEditing({ ...editing, longdescription: val })
                }
              />
            </div>

            {/* SPECS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between mb-4">
                <h2>Specifications</h2>
                <button onClick={addSpec} className="bg-black text-white px-3 py-1 rounded">
                  + Add
                </button>
              </div>

              {editing.specifications?.map((s, i) => (
                <div key={i} className="grid grid-cols-5 gap-2 mb-2">
                  <input
                    value={s.key}
                    onChange={(e) => updateSpec(i, "key", e.target.value)}
                    className="col-span-2 border p-2 rounded"
                  />
                  <input
                    value={s.value}
                    onChange={(e) => updateSpec(i, "value", e.target.value)}
                    className="col-span-2 border p-2 rounded"
                  />
                  <button onClick={() => removeSpec(i)}>✕</button>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <select
                value={editing.stock}
                onChange={(e) =>
                  setEditing({ ...editing, stock: e.target.value === "true" })
                }
                className="w-full border p-3 rounded"
              >
                <option value="true">In Stock</option>
                <option value="false">Out of Stock</option>
              </select>
            </div>

            {/* IMAGES */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <input
                type="file"
                multiple
                onChange={(e) => uploadImages([...e.target.files])}
              />

              <div className="grid grid-cols-3 gap-2 mt-3">
                {editing.images?.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img} className="h-20 w-full object-cover" />
                    <button
                      onClick={() =>
                        setEditing({
                          ...editing,
                          images: editing.images.filter((_, idx) => idx !== i),
                        })
                      }
                      className="absolute top-1 right-1 bg-black text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleUpdate}
              className="w-full bg-black text-white py-3 rounded-xl"
            >
              Update Product
            </button>

          </div>

        </div>
      )}

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {products.map((p) => (
          <div key={p._id} className="bg-white p-3 rounded-xl shadow-sm">
            <img
              src={p.image || p.images?.[0]}
              className="w-full h-32 object-cover rounded"
            />
            <h3 className="mt-2 text-sm">{p.name}</h3>

            <div className="flex gap-2 mt-3">
      

  <button
    onClick={() => setEditing(p)}
    className="flex-1 bg-gray-100 hover:bg-gray-200 text-sm py-2 rounded-lg transition"
  >
    Edit
  </button>

  <button
    onClick={() => handleDelete(p._id)}
    className="flex-1  bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-lg transition"
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