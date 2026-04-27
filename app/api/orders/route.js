import { connectDB } from "@/lib/Db"
import Order from "@/models/Order"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"
import crypto from "crypto"

// helper to get user
const getUser = (req) => {
  try {
    const auth = req.headers.get("authorization")
    if (!auth) return null

    const token = auth.split(" ")[1]
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    return null
  }
}


// ✅ CREATE ORDER (WITH PAYMENT VERIFICATION)
export async function POST(req) {
  await connectDB()

  const user = getUser(req)

  if (!user) {
    return Response.json({ msg: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    products,
    total
  } = data

  // 🔐 VERIFY PAYMENT SIGNATURE
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex")

  if (expectedSignature !== razorpay_signature) {
    return Response.json(
      { msg: "Payment verification failed" },
      { status: 400 }
    )
  }

  // ✅ generate order ID
  const orderId = `MT-${uuidv4().slice(0, 8)}`

  // ✅ SAVE ORDER ONLY AFTER PAYMENT SUCCESS
  const order = await Order.create({
    orderId,
    userId: user.id,
    products,
    total,
    paymentId: razorpay_payment_id,
    razorpayOrderId: razorpay_order_id,
    status: "paid"
  })

  return Response.json({
    msg: "Payment successful, order placed",
    order
  })
}


// GET ORDERS (UNCHANGED)
export async function GET(req) {
  await connectDB()

  const user = getUser(req)

  if (!user) {
    return Response.json({ msg: "Unauthorized" }, { status: 401 })
  }

  let orders

  if (user.role === "admin") {
    orders = await Order.find().sort({ createdAt: -1 })
  } else {
    orders = await Order.find({ userId: user.id })
  }

  return Response.json(orders)
}