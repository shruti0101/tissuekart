import { connectDB } from "@/lib/Db";
import Product from "@/models/Product";

export async function GET(req, context) {
  try {
    await connectDB();

    // ✅ FIX: await params
    const { slug } = await context.params;

    console.log("SLUG:", slug); // debug

    const product = await Product.findOne({ slug }).populate("category");

    if (!product) {
      return Response.json(
        { msg: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json(product);

  } catch (err) {
    console.error(err);
    return Response.json(
      { msg: "Server error" },
      { status: 500 }
    );
  }
}