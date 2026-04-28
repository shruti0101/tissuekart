import { connectDB } from "@/lib/Db";
import Order from "@/models/Order";
import mongoose from "mongoose";

// ================= GET SINGLE ORDER =================
export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = params;

    let order = null;

    // 🔍 Find by Mongo ID
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    }

    // 🔍 OR find by custom orderId
    if (!order) {
      order = await Order.findOne({ orderId: id });
    }

    if (!order) {
      return Response.json(
        { msg: "Order not found" },
        { status: 404 }
      );
    }

    // ✅ RETURN JSON (NO PDF)
    return Response.json(order);

  } catch (err) {
    console.error(err);
    return Response.json(
      { msg: "Server error" },
      { status: 500 }
    );
  }
}