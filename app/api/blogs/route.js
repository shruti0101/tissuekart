import { connectDB } from "@/lib/Db"
import Blog from "@/models/Blog"

// GET all blogs
export async function GET() {
  await connectDB()

  const blogs = await Blog.find().sort({ createdAt: -1 })

  return Response.json(blogs)
}

// CREATE blog (Admin)
export async function POST(req) {
  await connectDB()

  const data = await req.json()

  const blog = await Blog.create(data)

  return Response.json({
    msg: "Blog created",
    blog
  })
}