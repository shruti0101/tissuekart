import { connectDB } from "@/lib/Db";
import Product from "@/models/Product";
import mongoose from "mongoose";
import { deleteFromR2 } from "@/utils/deleteFromR2";
import { uploadToR2 } from "@/utils/uploadToR2";

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ msg: "Invalid ID" }, { status: 400 });
    }

    const formData = await req.formData();
    const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-")         // spaces → hyphen
    .replace(/-+/g, "-");         // remove duplicate -
};

    // ✅ BASIC FIELDS
    const name = formData.get("name");
    const slug = generateSlug(name);
    const price = Number(formData.get("price"));
    const oldPrice = Number(formData.get("oldPrice"));

    const description = formData.get("description");
    const longdescription = formData.get("longdescription");

    const category = formData.get("category");
    const stock = formData.get("stock") === "true";

    // ✅ ARRAY FIELDS
    const features = JSON.parse(formData.get("features") || "[]");

    const specifications = JSON.parse(
      formData.get("specifications") || "[]"
    );

    const oldImages = JSON.parse(
      formData.get("oldImages") || "[]"
    );

    // ✅ FILES
    const files = formData.getAll("newImages") || [];

    let uploadedImages = [];

    for (const image of files) {
      if (!image || image.size === 0) continue;

      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${Math.random()}-${image.name}`;

      const resUpload = await uploadToR2({
        file: buffer,
        folder: "tissueKart/products",
        fileName,
        contentType: image.type,
      });

      uploadedImages.push({
        url: resUpload.url,
        key: resUpload.key,
      });
    }

    // ✅ FINAL IMAGES
    const finalImages = [...oldImages, ...uploadedImages];

    // ✅ EXISTING PRODUCT
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return Response.json({ msg: "Product not found" }, { status: 404 });
    }

    // ✅ DELETE REMOVED IMAGES
    const removedImages = existingProduct.images.filter(
      (oldImg) => !finalImages.find((img) => img.key === oldImg.key)
    );

    for (const img of removedImages) {
      if (img.key) {
        try {
          await deleteFromR2(img.key);
        } catch (err) {
          console.error("R2 delete failed:", err);
        }
      }
    }

    // ✅ UPDATE ALL FIELDS
    const updated = await Product.findByIdAndUpdate(
      id,
      {
        name,
        slug,
        price,
        oldPrice,
        description,
        longdescription,
        features,
        specifications,
        category,
        stock,
        images: finalImages,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return Response.json(updated);

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return Response.json({ msg: err.message }, { status: 500 });
  }
}