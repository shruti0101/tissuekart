import { connectDB } from "@/lib/Db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");

    let filter = {};

    // ✅ CATEGORY FILTER (MAIN FIX)
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });

      if (!category) {
        return Response.json([]); // no category found
      }

      filter.category = category._id; // 🔥 match by ObjectId
    }

    const products = await Product.find(filter)
      .populate("category")
      .sort({ createdAt: -1 });

    return Response.json(products);
  } catch (err) {
    console.error("PRODUCT FETCH ERROR:", err);
    return Response.json({ msg: "Server error" }, { status: 500 });
  }
}