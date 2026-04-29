import { connectDB } from "@/lib/Db";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { sendOrderEmail } from "@/lib/sendEmail"; // ✅ ADD THIS

// 🔐 Get user from token
const getUser = (req) => {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) return null;

    const token = auth.split(" ")[1];
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

// ================= CREATE ORDER =================
export async function POST(req) {
  await connectDB();

  const user = getUser(req);
  if (!user) {
    return Response.json({ msg: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
console.log("ORDER DATA RECEIVED:", data);
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    products,
    total,
    paymentMethod,
    name,
    email,
    phone,
    address,
    pincode,
  } = data;

  let paymentStatus = "pending";

  // ================= ONLINE PAYMENT =================
  if (paymentMethod === "razorpay") {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return Response.json(
        { msg: "Payment verification failed" },
        { status: 400 }
      );
    }

    paymentStatus = "paid";
  }

  // ================= COD =================
  if (paymentMethod === "cod") {
    paymentStatus = "pending";
  }

  // ✅ Generate Order ID
  const orderId = `MT-${uuidv4().slice(0, 8)}`;

  // ✅ Save Order
  const order = await Order.create({
    orderId,
    userId: user.id,
    products,
    total,
    paymentMethod,
    paymentStatus,
    paymentId: razorpay_payment_id || null,
    razorpayOrderId: razorpay_order_id || null,

    // 👇 CUSTOMER INFO (IMPORTANT)
    name,
    email,
    phone,
    address,
    pincode,

   status: paymentStatus === "paid" ? "paid" : "pending"
  });

  // ================= SEND EMAIL =================
  try {
    if (email) {
      await sendOrderEmail({
        to: email,
        order,
      });
    }
  } catch (err) {
    console.error("Email failed:", err.message);
  }

  return Response.json({
    msg: "Order placed successfully",
    order,
  });
}

// ================= GET ORDERS =================
export async function GET(req) {
  await connectDB();

  const user = getUser(req);

  if (!user) {
    return Response.json({ msg: "Unauthorized" }, { status: 401 });
  }

  let orders;

  if (user.role === "admin") {
    orders = await Order.find().sort({ createdAt: -1 });
  } else {
    orders = await Order.find({ userId: user.id }).sort({ createdAt: -1 });
  }

  return Response.json(orders);
}