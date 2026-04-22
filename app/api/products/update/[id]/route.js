import { connectDB } from "@/lib/Db";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";

export async function PUT(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return Response.json({ msg: "No token" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return Response.json({ msg: "Invalid token" }, { status: 401 });
    }

    if (decoded.role !== "admin") {
      return Response.json({ msg: "Not authorized" }, { status: 403 });
    }

    const body = await req.json();

    delete body._id;

    const updated = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return Response.json(updated);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return Response.json({ msg: "Server error" }, { status: 500 });
  }
}