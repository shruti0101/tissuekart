import { connectDB } from "@/lib/Db"
import Order from "@/models/Order"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"

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


// CREATE ORDER
export async function POST(req) {
  await connectDB()

  const user = getUser(req)

  if (!user) {
    return Response.json({ msg: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()

  // ✅ FIX: generate inside function
  const orderId = `MT-${uuidv4().slice(0,8)}`

  const order = await Order.create({
    orderId,
    userId: user.id,
    products: data.products,
    total: data.total
  })

  return Response.json({
    msg: "Order placed",
    order
  })
}


// GET ORDERS
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