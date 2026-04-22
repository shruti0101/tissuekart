import { connectDB } from "@/lib/Db";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";

export async function DELETE(req, context) {
  try {
    await connectDB();

   
    const { id } = await context.params;

    if (!id) {
      return Response.json({ msg: "Missing ID" }, { status: 400 });
    }

   
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return Response.json({ msg: "No token" }, { status: 401 });
    }

    // ✅ VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return Response.json({ msg: "Not authorized" }, { status: 403 });
    }

    // ✅ DELETE FROM DB
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return Response.json({ msg: "Product not found" }, { status: 404 });
    }

    return Response.json({ msg: "Deleted successfully" });

  } catch (err) {
    console.error(err);
    return Response.json({ msg: "Server error" }, { status: 500 });
  }
}