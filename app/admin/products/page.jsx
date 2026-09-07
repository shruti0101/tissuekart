
"use client";

import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import JoditEditor from "jodit-react";

export default function ProductList() {
  const editor = useRef(null);

  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [categories, setCategories] = useState([]);

  const [previewImages, setPreviewImages] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchProducts();

    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch((err) => console.error("Category error:", err));
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Fetch products error:", error);
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================
  const handleDelete = async (id) => {
    const toastId = toast.loading("Deleting...");

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("User not logged in ❌", {
        id: toastId,
      });
      return;
    }

    try {
      const res = await fetch(`/api/products/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.msg || "Delete failed ❌", {
          id: toastId,
        });
        return;
      }

      setProducts((prev) =>
        prev.filter((p) => p._id !== id)
      );

      toast.success("Deleted ✅", {
        id: toastId,
      });
    } catch (err) {
      console.error(err);

      toast.error("Something went wrong ❌", {
        id: toastId,
      });
    }
  };

  // =========================
  // IMAGE UPLOAD
  // =========================
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    setFiles(selectedFiles);

    const previews = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewImages(previews);
  };

  // =========================
  // SPECIFICATIONS
  // =========================
  const addSpec = () => {
    setEditing({
      ...editing,
      specifications: [
        ...(editing.specifications || []),
        {
          key: "",
          value: "",
        },
      ],
    });
  };

  const updateSpec = (i, field, value) => {
    const updated = [...(editing.specifications || [])];

    updated[i][field] = value;

    setEditing({
      ...editing,
      specifications: updated,
    });
  };

  const removeSpec = (i) => {
    setEditing({
      ...editing,
      specifications: editing.specifications.filter(
        (_, idx) => idx !== i
      ),
    });
  };

  // =========================
  // UPDATE PRODUCT
  // =========================
  const updateProduct = async () => {
    const toastId = toast.loading("Updating product...");

    try {
      const formData = new FormData();

      // BASIC DATA
      formData.append("name", editing.name || "");
      formData.append("price", editing.price || 0);
      formData.append(
        "oldPrice",
        editing.oldPrice || ""
      );

      // CATEGORY
      formData.append(
        "category",
        typeof editing.category === "object"
          ? editing.category?._id || ""
          : editing.category || ""
      );

      // CONTENT
      formData.append(
        "description",
        editing.description || ""
      );

      formData.append(
        "longdescription",
        editing.longdescription || ""
      );

      formData.append(
        "stock",
        String(editing.stock)
      );

      // FEATURES
      formData.append(
        "features",
        JSON.stringify(editing.features || [])
      );

      // SPECIFICATIONS
      formData.append(
        "specifications",
        JSON.stringify(
          editing.specifications || []
        )
      );

      // =========================
      // SEO META DATA
      // =========================
      formData.append(
        "metaTitle",
        editing.metaTitle || ""
      );

      formData.append(
        "metaDescription",
        editing.metaDescription || ""
      );

      // OLD IMAGES
      formData.append(
        "oldImages",
        JSON.stringify(editing.images || [])
      );

      // NEW IMAGES
      files.forEach((file) => {
        formData.append("newImages", file);
      });


      console.log(formData)

      // API REQUEST
      const res = await fetch(
        `/api/products/update/${editing._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.msg || "Update failed"
        );
      }

      toast.success(
        "Product updated successfully ✅",
        {
          id: toastId,
        }
      );

      await fetchProducts();

      setEditing(null);
      setPreviewImages([]);
      setFiles([]);
    } catch (err) {
      console.error(err);

      toast.error(
        err.message || "Update failed ❌",
        {
          id: toastId,
        }
      );
    }
  };

  // =========================
  // REMOVE OLD IMAGE
  // =========================
  const removeOldImage = (index) => {
    const updated = editing.images.filter(
      (_, i) => i !== index
    );

    setEditing({
      ...editing,
      images: updated,
    });
  };

  // =========================
  // REMOVE NEW IMAGE
  // =========================
  const removeNewImage = (index) => {
    const updatedFiles = files.filter(
      (_, i) => i !== index
    );

    const updatedPreview = previewImages.filter(
      (_, i) => i !== index
    );

    setFiles(updatedFiles);
    setPreviewImages(updatedPreview);
  };

  return (
    <div className="p-8 bg-[#F6F7FB] min-h-screen">

      {/* =========================
          HEADER
      ========================= */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-4xl font-semibold">
          All Products
        </h1>

        {editing && (
          <button
            onClick={() => {
              setEditing(null);
              setPreviewImages([]);
              setFiles([]);
              fetchProducts();
            }}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* =========================
          EDIT MODE
      ========================= */}
      {editing && (
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          {/* =========================
              LEFT
          ========================= */}
          <div className="md:col-span-2 space-y-6">

            {/* BASIC INFO */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="mb-4 font-semibold text-gray-700">
                Basic Info
              </h2>

              <input
                value={editing.name || ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    name: e.target.value,
                  })
                }
                className="w-full border p-3 rounded-lg mb-3"
                placeholder="Product Name"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={editing.price || ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      price: e.target.value,
                    })
                  }
                  className="border p-3 rounded-lg"
                  placeholder="Price"
                />

                <input
                  type="number"
                  value={editing.oldPrice || ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      oldPrice: e.target.value,
                    })
                  }
                  className="border p-3 rounded-lg"
                  placeholder="Old Price"
                />
              </div>

              <select
                value={
                  typeof editing.category === "object"
                    ? editing.category?._id || ""
                    : editing.category || ""
                }
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    category: e.target.value,
                  })
                }
                className="w-full border p-3 rounded-lg mt-3"
              >
                <option value="">
                  Select Category
                </option>

                {categories.map((c) => (
                  <option
                    key={c._id}
                    value={c._id}
                  >
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* =========================
                PRODUCT CONTENT
            ========================= */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="mb-4 font-semibold text-gray-700">
                Product Content
              </h2>

              <textarea
                value={editing.description || ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    description: e.target.value,
                  })
                }
                className="w-full border p-3 rounded-lg mb-3"
                placeholder="Short Description"
                rows={4}
              />

              <textarea
                value={
                  editing.features?.join(",") || ""
                }
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    features: e.target.value
                      .split(",")
                      .map((item) => item.trim()),
                  })
                }
                className="w-full border p-3 rounded-lg mb-3"
                placeholder="Features (comma separated)"
                rows={4}
              />

              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Full Description
                </p>

                <div className="border rounded-lg overflow-hidden">
                  <JoditEditor
                    ref={editor}
                    value={
                      editing.longdescription || ""
                    }
                    onChange={(val) =>
                      setEditing({
                        ...editing,
                        longdescription: val,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* =========================
                SEO SETTINGS
            ========================= */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">

              <h2 className="font-semibold text-gray-700">
                SEO Settings
              </h2>

              <p className="text-sm text-gray-500 mt-1 mb-5">
                Add the meta title and meta description
                for search engines.
              </p>

              {/* META TITLE */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>

                <input
                  type="text"
                  value={editing.metaTitle || ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      metaTitle: e.target.value,
                    })
                  }
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="Enter meta title"
                />

                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>
                    Recommended: 50–60 characters
                  </span>

                  <span>
                    {(editing.metaTitle || "").length}/60
                  </span>
                </div>
              </div>

              {/* META DESCRIPTION */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>

                <textarea
                  value={
                    editing.metaDescription || ""
                  }
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      metaDescription:
                        e.target.value,
                    })
                  }
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="Enter meta description"
                  rows={5}
                />

                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>
                    Recommended: 150–160 characters
                  </span>

                  <span>
                    {(editing.metaDescription || "").length}/160
                  </span>
                </div>
              </div>
            </div>

            {/* =========================
                SPECIFICATIONS
            ========================= */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">

              <div className="flex justify-between mb-4">
                <h2 className="font-semibold text-gray-700">
                  Specifications
                </h2>

                <button
                  type="button"
                  onClick={addSpec}
                  className="bg-black text-white px-3 py-1 rounded"
                >
                  + Add
                </button>
              </div>

              {editing.specifications?.map(
                (s, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-5 gap-2 mb-2"
                  >
                    <input
                      value={s.key || ""}
                      onChange={(e) =>
                        updateSpec(
                          i,
                          "key",
                          e.target.value
                        )
                      }
                      placeholder="Key"
                      className="col-span-2 border p-2 rounded"
                    />

                    <input
                      value={s.value || ""}
                      onChange={(e) =>
                        updateSpec(
                          i,
                          "value",
                          e.target.value
                        )
                      }
                      placeholder="Value"
                      className="col-span-2 border p-2 rounded"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeSpec(i)
                      }
                      className="bg-red-100 text-red-600 rounded"
                    >
                      ✕
                    </button>
                  </div>
                )
              )}
            </div>
          </div>

          {/* =========================
              RIGHT
          ========================= */}
          <div className="space-y-6">

            {/* STATUS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="font-semibold mb-4">
                Status
              </h2>

              <select
                value={editing.stock}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    stock:
                      e.target.value === "true",
                  })
                }
                className="w-full border p-3 rounded"
              >
                <option value="true">
                  In Stock
                </option>

                <option value="false">
                  Out of Stock
                </option>
              </select>
            </div>

            {/* =========================
                IMAGES
            ========================= */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">

              <h2 className="font-semibold mb-3">
                Product Images
              </h2>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />

              <div className="flex flex-wrap gap-3 mt-4">

                {/* OLD IMAGES */}
                {editing?.images?.map(
                  (img, i) => (
                    <div
                      key={i}
                      className="relative"
                    >
                      <img
                        src={
                          typeof img === "string"
                            ? img
                            : img.url
                        }
                        alt={`Product ${i + 1}`}
                        className="w-24 h-24 object-cover rounded"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeOldImage(i)
                        }
                        className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  )
                )}

                {/* NEW IMAGES */}
                {previewImages.map(
                  (src, i) => (
                    <div
                      key={i}
                      className="relative"
                    >
                      <img
                        src={src}
                        alt={`New preview ${i + 1}`}
                        className="w-24 h-24 object-cover rounded"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeNewImage(i)
                        }
                        className="absolute top-0 right-0 bg-black text-white text-xs px-1 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* UPDATE */}
            <button
              type="button"
              onClick={updateProduct}
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
            >
              Update Product
            </button>
          </div>
        </div>
      )}

      {/* =========================
          PRODUCT GRID
      ========================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

        {products.map((p) => {
          const imageUrl =
            p?.images &&
            p.images.length > 0
              ? typeof p.images[0] === "string"
                ? p.images[0]
                : p.images[0].url
              : "/no-image.png";

          return (
            <div
              key={p._id}
              className="bg-white p-3 rounded-xl shadow-sm"
            >
              <img
                src={imageUrl}
                alt={p.name}
                className="w-full h-32 object-cover rounded"
              />

              <h3 className="mt-2 text-sm">
                {p.name}
              </h3>

              <div className="flex gap-2 mt-3">

                <button
                  type="button"
                  onClick={() => {
                    setEditing({
                      ...p,

                      // Make sure SEO fields
                      // exist for older products
                      metaTitle:
                        p.metaTitle || "",

                      metaDescription:
                        p.metaDescription || "",

                      specifications:
                        p.specifications || [],

                      features:
                        p.features || [],

                      images:
                        p.images || [],
                    });

                    setFiles([]);
                    setPreviewImages([]);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-sm py-2 rounded-lg transition"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(p._id)
                  }
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-lg transition"
                >
                  Delete
                </button>

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}

