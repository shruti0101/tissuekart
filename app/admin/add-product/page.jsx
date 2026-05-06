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
  const [stock, setStock] = useState(true);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const [specs, setSpecs] = useState([{ key: "", value: "" }]);

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  // ✅ Fetch categories
  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(setCategories);
  }, []);

  // ✅ SPEC FUNCTIONS
  const addSpec = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const updateSpec = (index, field, value) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  const removeSpec = (index) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  // ✅ IMAGE UPLOAD (Cloudinary)
const uploadImages = async (files) => {
  setUploading(true);
  const toastId = toast.loading("Uploading images...");

  try {
    const uploadPromises = files.map(async (file) => {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET);

        // ✅ ADD THIS LINE
  data.append("folder", "Tissuekartproducts"); 

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error?.message || "Upload failed");
      }

      return result.secure_url;
    });

    const urls = await Promise.all(uploadPromises);

    setImages((prev) => [...prev, ...urls]);
    toast.success("Images uploaded", { id: toastId });

  } catch (err) {
    console.error(err);
    toast.error(err.message, { id: toastId });
  } finally {
    setUploading(false);
  }
};

  // ✅ SUBMIT
  const handleSubmit = async () => {
    if (!images.length) return toast.error("Upload image first");

    const toastId = toast.loading("Adding product...");

    const token = localStorage.getItem("token");

    const payload = {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : 0,
      description,
      longdescription,
      features: features.split(","),
      stock,
      category,
      images,
      specifications: specs,
    };

    const res = await fetch("/api/products/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      toast.error("Error adding product", { id: toastId });
      return;
    }

    toast.success("Product Added ✅", { id: toastId });

    // reset
    setName("");
    setPrice("");
    setOldPrice("");
    setDescription("");
    setLongdescription("");
    setFeatures("");
    setStock(true);
    setCategory("");
    setImages([]);
    setSpecs([{ key: "", value: "" }]);
  };

  return (
    <div className="p-8 bg-[#F6F7FB] min-h-screen">

      {/* HEADER */}
      <h1 className="text-2xl font-semibold mb-8 text-gray-800">
        Add Product
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">

          {/* BASIC */}
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
                className="border p-3 rounded-lg"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <input
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
              <option>Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="font-semibold mb-4 text-gray-700">Product Content</h2>

            <textarea
              className="w-full border p-3 rounded-lg mb-3"
              placeholder="Short Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <textarea
              className="w-full border p-3 rounded-lg mb-3"
              placeholder="Features (comma separated)"
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

          {/* SPECS */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-gray-700">Specifications</h2>
              <button
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
                  onClick={() => removeSpec(i)}
                  className="bg-red-100 text-red-600 rounded-lg"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT */}
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
            <h2 className="font-semibold mb-4">Images</h2>

            <input
              type="file"
              multiple
              onChange={(e) => uploadImages([...e.target.files])}
            />

            <div className="grid grid-cols-3 gap-2 mt-3">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} className="h-20 w-full object-cover rounded" />
                  <button
                    onClick={() =>
                      setImages(images.filter((_, idx) => idx !== i))
                    }
                    className="absolute top-1 right-1 bg-black text-white text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="w-full bg-black text-white py-3 rounded-xl"
          >
            {uploading ? "Uploading..." : "Publish Product"}
          </button>

        </div>

      </div>
    </div>
  );
}