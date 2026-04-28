import { connectDB } from "@/lib/Db"
import User from "@/models/User"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    await connectDB()

    const { name, email,phone, password } = await req.json()

    // check existing user
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      )
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // create user
    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    })

    return NextResponse.json({
      message: "User registered successfully",
      user: newUser,
    })

  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    )
  }
}