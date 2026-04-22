import { connectDB } from "@/lib/Db"
import Product from "@/models/Product"
import jwt from "jsonwebtoken"

export async function PUT(req, { params }) {

  await connectDB()

  const token = req.headers.get("authorization")?.split(" ")[1]

  if (!token) return Response.json({ msg: "No token" }, { status: 401 })

  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  if (decoded.role !== "admin") {
    return Response.json({ msg: "Not authorized" }, { status: 403 })
  }

  const body = await req.json()

  const updated = await Product.findByIdAndUpdate(params.id, body, { new: true })

  return Response.json(updated)
}