import { connectDB } from "@/lib/Db"
import User from "@/models/User"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(req) {

  await connectDB()

  const { email, password } = await req.json()

  const user = await User.findOne({ email })
  if (!user) return Response.json({ msg: "User not found" }, { status: 400 })

  const match = await bcrypt.compare(password, user.password)
  if (!match) return Response.json({ msg: "Wrong password" }, { status: 400 })

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )

  return Response.json({ token, user })
}