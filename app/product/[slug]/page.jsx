
import { connectDB } from "@/lib/Db";
import Product from "@/models/Product";
import ProductPage from "./ProductClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    await connectDB();

    const product = await Product.findOne({ slug })
      .populate("category")
      .lean();

      console.log(product)

    if (!product) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      };
    }

    const title =
      product.metaTitle?.trim() ||
      product.name ||
      "Product";

    const description =
      product.metaDescription?.trim() ||
      product.description ||
      "";

    return {
      title,
      description,

      openGraph: {
        title,
        description,

        images: product.images?.[0]?.url
          ? [
              {
                url: product.images[0].url,
                alt: product.name,
              },
            ]
          : [],
      },
    };
  } catch (error) {
    console.error("Metadata error:", error);

    return {
      title: "Product",
      description: "",
    };
  }
}

export default function Page() {
  return <ProductPage />;
}

