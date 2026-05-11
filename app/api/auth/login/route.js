import { connectDB } from "@/lib/Db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  const { email, password } = await req.json();

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json(
      { msg: "User not found" },
      { status: 400 }
    );
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return NextResponse.json(
      { msg: "Wrong password" },
      { status: 400 }
    );
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // CREATE RESPONSE
  const response = NextResponse.json({
    success: true,
    user,
  });

  // SET COOKIE
  response.cookies.set("adminToken", token, {
    httpOnly: true,
    secure: false, 
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}