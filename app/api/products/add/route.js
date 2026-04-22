import { connectDB } from "@/lib/Db"
import Product from "@/models/Product"
import jwt from "jsonwebtoken"

export async function POST(req) {

  await connectDB()

  const token = req.headers.get("authorization")?.split(" ")[1]

  if (!token) return Response.json({ msg: "No token" }, { status: 401 })

  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  if (decoded.role !== "admin") {
    return Response.json({ msg: "Not authorized" }, { status: 403 })
  }

  const body = await req.json()

  // ✅ GENERATE SLUG
  const slug = body.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")

  const product = await Product.create({
    ...body,
    slug
  })

  return Response.json(product)
}