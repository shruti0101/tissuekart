import { connectDB } from "@/lib/Db";
import Category from "@/models/Category";

// ✅ CREATE
export async function POST(req) {
  await connectDB();
  const data = await req.json();

  const category = await Category.create(data);
  return Response.json(category);
}

// ✅ READ
export async function GET() {
  await connectDB();
  const categories = await Category.find();
  return Response.json(categories);
}

// ✅ DELETE
export async function DELETE(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await Category.findByIdAndDelete(id); 

  return Response.json({ success: true });
}


// ✅ UPDATE
export async function PUT(req) {
  await connectDB();

  const data = await req.json();

  const updated = await Category.findByIdAndUpdate(
    data._id,
    data,
    { new: true }
  );
}