"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import JoditEditor from "jodit-react";

export default function AddProduct() {
  const editor = useRef(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");

  const [description, setDescription] = useState("");
  const [longdescription, setLongdescription] = useState("");
  const [features, setFeatures] = useState("");

  // SEO
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const [stock, setStock] = useState(true);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  const [specs, setSpecs] = useState([{ key: "", value: "" }]);

  // Fetch categories
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch((err) => console.error("Category fetch error:", err));
  }, []);

  // Add specification
  const addSpec = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  // Update specification
  const updateSpec = (index, field, value) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  // Remove specification
  const removeSpec = (index) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  // Image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);

    const previewUrls = files.map((file) => URL.createObjectURL(file));

    setPreview(previewUrls);
  };

  // Remove image
  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreview = preview.filter((_, i) => i !== index);

    setImages(updatedImages);
    setPreview(updatedPreview);
  };

  // Submit product
  const handleSubmit = async () => {
    const toastId = toast.loading("Adding product...");
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();

      // Basic information
      formData.append("name", name);
      formData.append("slug", name.toLowerCase().trim().replace(/\s+/g, "-"));
      formData.append("price", price);
      formData.append("oldPrice", oldPrice || 0);

      // Product content
      formData.append("description", description);
      formData.append("longdescription", longdescription);
      formData.append(
        "features",
        JSON.stringify(
          features
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        ),
      );

      // SEO
      formData.append("metaTitle", metaTitle);
      formData.append("metaDescription", metaDescription);

      // Other fields
      formData.append("stock", stock);
      formData.append("category", category);

      // Specifications
      formData.append("specifications", JSON.stringify(specs));

      // Images
      images.forEach((img) => {
        formData.append("images", img);
      });

      const res = await fetch("/api/products/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));

        toast.error(errorData.message || "Error adding product", {
          id: toastId,
        });

        return;
      }

      toast.success("Product Added ✅", {
        id: toastId,
      });

      // Reset form
      setName("");
      setPrice("");
      setOldPrice("");
      setDescription("");
      setLongdescription("");
      setFeatures("");

      // Reset SEO
      setMetaTitle("");
      setMetaDescription("");

      setStock(true);
      setCategory("");
      setSpecs([{ key: "", value: "" }]);
      setImages([]);
      setPreview([]);
    } catch (err) {
      console.error(err);

      toast.error("Something went wrong", {
        id: toastId,
      });
    }
  };

  return (
    <div className="p-8 bg-[#F6F7FB] min-h-screen">
      <h1 className="text-2xl font-semibold mb-8 text-gray-800">Add Product</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* ================= LEFT ================= */}
        <div className="md:col-span-2 space-y-6">
          {/* BASIC INFO */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="font-semibold mb-4 text-gray-700">Basic Info</h2>

            <input
              className="w-full border p-3 rounded-lg mb-3"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                className="border p-3 rounded-lg"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <input
                type="number"
                className="border p-3 rounded-lg"
                placeholder="Old Price"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border p-3 rounded-lg mt-3"
            >
              <option value="">Select Category</option>

              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* PRODUCT CONTENT */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="font-semibold mb-4 text-gray-700">
              Product Content
            </h2>

            <textarea
              className="w-full border p-3 rounded-lg mb-3"
              placeholder="Short Description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <textarea
              className="w-full border p-3 rounded-lg mb-3"
              placeholder="Features (comma separated)"
              rows={4}
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
            />

            <div>
              <p className="mb-2 text-sm text-gray-600">Full Description</p>

              <div className="border rounded-lg overflow-hidden">
                <JoditEditor
                  ref={editor}
                  value={longdescription}
                  onChange={(val) => setLongdescription(val)}
                />
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="font-semibold mb-1 text-gray-700">SEO Settings</h2>

            <p className="text-sm text-gray-500 mb-5">
              Add custom metadata for search engines. Leave blank if you want to
              add it later.
            </p>

            {/* Meta Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title
              </label>

              <input
                type="text"
                className="w-full border p-3 rounded-lg"
                placeholder="Enter meta title"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
              />

              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Recommended: around 50–60 characters</span>
                <span>{metaTitle.length}/60</span>
              </div>
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </label>

              <textarea
                className="w-full border p-3 rounded-lg"
                rows={4}
                placeholder="Enter meta description"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
              />

              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Recommended: around 150–160 characters</span>
                <span>{metaDescription.length}/160</span>
              </div>
            </div>
          </div>

          {/* SPECIFICATIONS */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-gray-700">Specifications</h2>

              <button
                type="button"
                onClick={addSpec}
                className="bg-black text-white px-3 py-1 rounded-lg text-sm"
              >
                + Add
              </button>
            </div>

            {specs.map((spec, i) => (
              <div key={i} className="grid grid-cols-5 gap-2 mb-2">
                <input
                  value={spec.key}
                  onChange={(e) => updateSpec(i, "key", e.target.value)}
                  placeholder="Key"
                  className="col-span-2 border p-2 rounded-lg"
                />

                <input
                  value={spec.value}
                  onChange={(e) => updateSpec(i, "value", e.target.value)}
                  placeholder="Value"
                  className="col-span-2 border p-2 rounded-lg"
                />

                <button
                  type="button"
                  onClick={() => removeSpec(i)}
                  className="bg-red-100 text-red-600 rounded-lg"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="space-y-6">
          {/* STATUS */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="font-semibold mb-4">Status</h2>

            <select
              value={stock}
              onChange={(e) => setStock(e.target.value === "true")}
              className="w-full border p-3 rounded-lg"
            >
              <option value="true">In Stock</option>

              <option value="false">Out of Stock</option>
            </select>
          </div>

          {/* IMAGES */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="font-semibold mb-2">Upload Images</h2>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mb-4"
            />

            <div className="grid grid-cols-3 gap-3">
              {preview.map((src, i) => (
                <div key={i} className="relative">
                  <img
                    src={src}
                    alt={`Preview ${i + 1}`}
                    className="h-24 w-full object-cover rounded-lg border"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-black text-white text-xs px-2 py-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* PUBLISH */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
          >
            Publish Product
          </button>
        </div>
      </div>
    </div>
  );
}
