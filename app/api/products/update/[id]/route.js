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
      return Response.json(
        { msg: "Invalid product id" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const generateSlug = (text = "") => {
      return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    };

    // BASIC DATA
    const name = formData.get("name") || "";
    const slug = generateSlug(name);
    const price = Number(formData.get("price") || 0);
    const oldPrice = Number(formData.get("oldPrice") || 0);
    const description = formData.get("description") || "";
    const longdescription = formData.get("longdescription") || "";
    let category = formData.get("category");
    console.log("id:", id);
    console.log("raw category:", formData.get("category"));
    console.log("parsed category:", category);
    if (category) {
      try {
        const parsed = JSON.parse(category);
        if (parsed?._id) {
          category = parsed._id;
        }
      } catch {
      }
    }

    if (typeof category === "string" && category.includes("[object Object]")) {
      return Response.json(
        { msg: "Category object sent. Send only category._id" },
        { status: 400 }
      );

    }

    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      return Response.json(
        { msg: "Invalid category id", received: category },
        { status: 400 }
      );

    }

    const stock = formData.get("stock") === "true";
    const features = JSON.parse(formData.get("features") || "[]");
    const specifications = JSON.parse(formData.get("specifications") || "[]");
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return Response.json({ msg: "Product not found" }, { status: 404 });
    }

    const existingImages = (existingProduct.images || []).map((img) => {
      if (typeof img === "string") {
        return { url: img, key: null };
      }
      return img;
    });

    let oldImages = JSON.parse(formData.get("oldImages") || "[]");
    oldImages = oldImages.map((img) => {
      if (typeof img === "string") {
        return { url: img, key: null };
      }

      return img;
    });

    // UPLOAD NEW R2 IMAGES
    const files = formData.getAll("newImages");
    const uploadedImages = [];
    for (const image of files) {
      if (!image || image.size === 0) continue;
      const buffer = Buffer.from(await image.arrayBuffer());
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${image.name}`;

      const uploaded = await uploadToR2({
        file: buffer,
        folder: "tissueKart/products",
        fileName,
        contentType: image.type
      });

      uploadedImages.push({
        url: uploaded.url,
        key: uploaded.key
      });
    }

    // FINAL IMAGES
    const finalImages = [...oldImages, ...uploadedImages];

    // DELETE REMOVED R2 IMAGES
    const removedImages = existingImages.filter(oldImg => {
      if (!oldImg?.key) return false;
      return !finalImages.some(img => img.key === oldImg.key);
    });

    for (const img of removedImages) {
      try {
        await deleteFromR2(img.key);
      } catch (error) {
        console.log("R2 delete error:", error.message);
      }
    }

    // UPDATE
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
        images: finalImages
      },

      { returnDocument: "after", runValidators: true }
    );

    return Response.json(updated);
  }
  catch (error) {
    console.error("UPDATE ERROR:", error);
    return Response.json(
      { msg: error.message },
      { status: 500 }
    );
  }
}