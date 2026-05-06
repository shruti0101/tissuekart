import { connectDB } from "@/lib/Db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import CategoryClient from "./CategoryClient";

// ✅ META (FIXED)
export async function generateMetadata({ params }) {
  const resolvedParams = await params;   
  const slug = resolvedParams.slug;

  await connectDB();

  const category = await Category.findOne({ slug });

  return {
    title: category?.metaTitle || category?.name || "Category",
    description:
      category?.metaDescription ||
      `Explore ${category?.name} products at best prices`,
  };
}

// ✅ PAGE (FIXED)
export default async function CategoryPage({ params }) {
  const resolvedParams = await params;   // ✅ important
  const slug = resolvedParams.slug;

  await connectDB();

  const categories = await Category.find();
  const products = await Product.find({ "category.slug": slug });

  return (
    <CategoryClient
      slug={slug}
      categories={JSON.parse(JSON.stringify(categories))}
      products={JSON.parse(JSON.stringify(products))}
    />
  );
}