import { connectDB } from "@/lib/Db";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";
import { uploadToR2 } from "@/utils/uploadToR2";

export async function POST(req) {
  await connectDB();

  try {
    // 🔐 AUTH
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return Response.json({ msg: "No token" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return Response.json({ msg: "Not authorized" }, { status: 403 });
    }

    // ✅ GET FORMDATA
    const formData = await req.formData();

    // 🧾 TEXT DATA
    const name = formData.get("name");
    const price = formData.get("price");
    const oldPrice = formData.get("oldPrice");
    const description = formData.get("description");
    const longdescription = formData.get("longdescription");
    const stock = formData.get("stock") === "true";
    const category = formData.get("category");

    const features = JSON.parse(formData.get("features") || "[]");
    const specifications = JSON.parse(formData.get("specifications") || "[]");

    // ✅ SLUG
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    // 📸 IMAGES UPLOAD
    const files = formData.getAll("images");

    let images = [];

    for (const image of files) {
      if (!image || image.size === 0) continue;

      // 🔥 SAME AS YOUR LOGIC
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${image.name}`;

      const resUpload = await uploadToR2({
        file: buffer,
        folder: "tissueKart/products",
        fileName,
        contentType: image.type,
      });

      images.push({
        url: resUpload.url,
        key: resUpload.key,
      });
    }

    // 💾 SAVE PRODUCT
    const product = await Product.create({
      name,
      slug,
      price: Number(price),
      oldPrice: Number(oldPrice || 0),
      description,
      longdescription,
      features,
      stock,
      category,
      specifications,
      images, // ✅ stored here
    });

    return Response.json(product);
  } catch (err) {
    console.error(err);
    return Response.json(
      { msg: "Server error", error: err.message },
      { status: 500 },
    );
  }
}
