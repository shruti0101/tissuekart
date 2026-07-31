import { connectDB } from "@/lib/Db";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { deleteFromR2 } from "@/utils/deleteFromR2"; 

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = await params; // ✅ FIXED (no await)

    // ✅ Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ msg: "Invalid or missing ID" }, { status: 400 });
    }

    // ✅ Get token
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return Response.json({ msg: "No token" }, { status: 401 });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return Response.json({ msg: "Not authorized" }, { status: 403 });
    }

    // ✅ Find product first (for image deletion)
    const product = await Product.findById(id);

    if (!product) {
      return Response.json({ msg: "Product not found" }, { status: 404 });
    }

    // ✅ Delete images from R2 (optional but recommended)
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        try {
          await deleteFromR2(img.key); // 👈 implement this
          console.log("Delete from R2:", img.key);
        } catch (err) {
          console.error("R2 delete failed:", err);
        }
      }
    }

    // ✅ Delete from DB
    await Product.findByIdAndDelete(id);

    return Response.json({ msg: "Deleted successfully" });

  } catch (err) {
    console.error(err);

    // JWT error handling
    if (err.name === "JsonWebTokenError") {
      return Response.json({ msg: "Invalid token" }, { status: 401 });
    }

    return Response.json({ msg: "Server error" }, { status: 500 });
  }
}