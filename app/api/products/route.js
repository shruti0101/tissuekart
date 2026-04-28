import { connectDB } from "@/lib/Db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const search = searchParams.get("search"); // ✅ added

    let filter = {};

    // ✅ CATEGORY FILTER (YOUR ORIGINAL CODE - unchanged)
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });

      if (!category) {
        return Response.json([]);
      }

      filter.category = category._id;
    }

    // ✅ 🔥 SEARCH FILTER (ADDED ONLY THIS BLOCK)
    if (search && search.trim()) {
      const words = search.trim().split(" ");

      filter.$and = words.map((word) => ({
        name: {
          $regex: `\\b${word}`, // word match
          $options: "i",
        },
      }));
    }

    // ✅ YOUR ORIGINAL QUERY (UNCHANGED)
    const products = await Product.find(filter)
      .populate("category")
      .sort({ createdAt: -1 });

    return Response.json(products);

  } catch (err) {
    console.error("PRODUCT FETCH ERROR:", err);
    return Response.json({ msg: "Server error" }, { status: 500 });
  }
}