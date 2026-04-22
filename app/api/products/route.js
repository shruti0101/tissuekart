

import { NextResponse } from "next/server"
import { connectDB } from "@/lib/Db"
import Product from "@/models/Product"

export async function GET() {
  await connectDB()

  const products = await Product.find().sort({ createdAt: -1 })

  return NextResponse.json(products)
}