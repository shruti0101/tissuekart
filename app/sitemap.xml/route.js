import { connectDB } from "@/lib/Db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Blog from "@/models/Blog";

const BASE_URL = "https://tissuekart.com"

const staticPages = [
  "/",
  "/shop",
  "/sale",
  "/about-us",
  "/contact-us",
  "/faq",
  "/blogs",
  "/privacy-policy",
  "/terms-conditions",
  "/return-refund",
  "/shipping-cancellation-policy",
  "/bulk-enquiry",
  "/wishlist",
  "/cart",
  "/checkout",
];

const buildUrlEntry = (url, lastmod, changefreq = "weekly", priority = "0.7") => {
  const lastModTag = lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : "";
  return `
    <url>
      <loc>${BASE_URL}${url}</loc>
      ${lastModTag}
      <changefreq>${changefreq}</changefreq>
      <priority>${priority}</priority>
    </url>`;
};

export async function GET() {
  try {
    await connectDB();

    const [products, categories, blogs] = await Promise.all([
      Product.find({}, "slug updatedAt createdAt").lean(),
      Category.find({}, "slug updatedAt createdAt").lean(),
      Blog.find({}, "slug updatedAt createdAt").lean(),
    ]);

    const urls = [
      ...staticPages.map((page) => buildUrlEntry(page, new Date(), "daily", "1.0")),
      ...products.map((product) =>
        buildUrlEntry(
          `/product/${product.slug}`,
          product.updatedAt || product.createdAt,
          "weekly",
          "0.8"
        )
      ),
      ...categories.map((category) =>
        buildUrlEntry(
          `/category/${category.slug}`,
          category.updatedAt || category.createdAt,
          "weekly",
          "0.7"
        )
      ),
      ...blogs.map((blog) =>
        buildUrlEntry(
          `/blogs/${blog.slug}`,
          blog.updatedAt || blog.createdAt,
          "weekly",
          "0.7"
        )
      ),
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (err) {
    console.error("SITEMAP ERROR:", err);
    return new Response("<error>Failed to generate sitemap</error>", {
      status: 500,
      headers: {
        "Content-Type": "application/xml",
      },
    });
  }
}
