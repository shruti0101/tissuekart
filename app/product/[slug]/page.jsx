"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCartStore } from "@/components/store/cartStore";
import { useWishlistStore } from "@/components/store/wishlistStore";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { Check } from "lucide-react";

export default function ProductPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("/placeholder.png");
  const [tab, setTab] = useState("Description");

  const addItem = useCartStore((state) => state.addToCart);
  const wishlist = useWishlistStore((state) => state.wishlist);
  const addWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeWishlist = useWishlistStore((state) => state.removeFromWishlist);

  // ✅ Fetch product safely
  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/products/${slug}`);

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();

        if (!data || !data._id) {
          throw new Error("Invalid product");
        }

        setProduct(data);
        setActiveImage(data.images?.[0] || "/placeholder.png");
      } catch (err) {
        console.error("Product fetch error:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // ✅ Reset image when product changes
  useEffect(() => {
    if (product?.images?.length) {
      setActiveImage(product.images[0]);
    }
  }, [product]);

  if (loading) return <p className="text-center py-20">Loading...</p>;
  if (!product) return <p className="text-center py-20">Product not foundedee </p>;

  const inWishlist = wishlist.some((item) => item._id === product._id);

  const addToCart = () => {
    addItem(product, quantity);
    showToast("Added to cart 🛒");
  };

const handleWishlist = () => {

  if (inWishlist) {
    removeWishlist(product.id)
    toast("Removed from wishlist ❌")
  } else {
    addWishlist(product)
    toast.success("Added to wishlist ❤️")
  }

}

  const showToast = (message) => {
    toast(
      () => (
        <div className="flex items-center gap-3">
          <img
            src={product.images?.[0] || "/placeholder.png"}
            className="w-12 h-12 rounded object-cover"
          />
          <div>
            <p className="font-semibold">{product.name}</p>
            <p className="text-sm text-gray-500">{message}</p>
          </div>
        </div>
      ),
      { duration: 2500 }
    );
  };

  const discount =
    product.oldPrice > 0
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  return (
  <div className="w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-6 sm:py-10 mt-15 md:mt-32">

  {/* Breadcrumb */}
  <div className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
    Home / {product.category?.name || "Category"} / {product.name}
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-15">

    {/* Images */}
    <div>
      <div className="shadow-sm rounded-md overflow-hidden border h-[300px] sm:h-[400px] md:h-[500px] lg:h-[540px] border-gray-300 flex items-center justify-center">
        <Image
          src={activeImage}
          alt={product.name}
          width={1000}
          height={800}
          className="object-cover max-h-full"
        />
      </div>

   <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4 overflow-x-auto">
  {product.images?.map((img, i) => (
    <div
      key={i}
      onClick={() => setActiveImage(img)}
      className={`border-2 p-1 rounded cursor-pointer shrink-0 transition ${
        activeImage === img
          ? "border-teal-700"
          : "border-yellow-400 hover:border-yellow-500"
      }`}
    >
      <Image src={img} width={60} height={60} alt="" />
    </div>
  ))}
</div>
    </div>

    {/* Info */}
    <div>
      <p className="text-gray-500 text-xs sm:text-sm">
        {product.category?.name}
      </p>

      <h1 className="text-xl sm:text-2xl md:text-[28px] tracking-wide font-semibold mt-1">
        {product.name}
      </h1>

      {/* RATING */}
      <div className="flex items-center gap-2 mt-2 sm:mt-3">
        <div className="text-yellow-500 text-xs sm:text-sm">⭐⭐⭐⭐☆</div>
        <span className="text-gray-400 text-xs sm:text-sm">
          ({product.reviewsCount} reviews)
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 sm:mt-5">
        <span className="text-2xl sm:text-3xl font-bold">
          ₹{product.price}
        </span>

        {product.oldPrice > 0 && (
          <>
            <span className="line-through text-gray-400 text-sm sm:text-base">
              ₹{product.oldPrice}
            </span>

            <span className="bg-green-100 text-green-600 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
              {discount}% OFF
            </span>
          </>
        )}
      </div>

      {/* STOCK */}
      <p className="mt-2 sm:mt-3 text-xs sm:text-sm">
        <span className="text-gray-500">Availability: </span>
        <span
          className={`font-medium ${
            product.stock ? "text-green-600" : "text-red-500"
          }`}
        >
          {product.stock ? "In Stock" : "Out of Stock"}
        </span>
      </p>

      <p className="text-red-500 font-serif mt-2 text-xs sm:text-sm">
        Inclusive of all taxes
      </p>

      {/* DESCRIPTION */}
      <p className="mt-3 text-black text-sm sm:text-md leading-relaxed">
        {product.description}
      </p>

      {/* FEATURES */}
      <ul className="mt-4 sm:mt-5 font-bold space-y-1 text-sm sm:text-base md:text-lg font-serif text-black bg-[#F0FDFA] p-3 sm:p-4 rounded">
        {product.features?.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-black mt-[3px]" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* Quantity */}
      <div className="mt-5 sm:mt-6">
        <p className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">
          Quantity
        </p>

        <div className="flex items-center px-3 sm:px-4 py-2 bg-gray-100 gap-3 sm:gap-4 border w-max rounded">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)}>+</button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6 mt-6">
        <button
          onClick={addToCart}
          className="bg-[#129c97] w-full sm:w-auto px-6 sm:px-20 md:px-32 lg:px-40 py-3 rounded-lg text-white font-semibold text-sm sm:text-base"
        >
          ADD TO CART
        </button>

        <button
          onClick={handleWishlist}
          className="flex items-center justify-center sm:justify-start text-sm sm:text-lg gap-2"
        >
          <Heart size={22} fill={inWishlist ? "red" : "none"} />
          Add To Wishlist
        </button>
      </div>
    </div>
  </div>

  {/* Tabs */}
  <div className="mt-10 sm:mt-12">
    <div className="flex gap-4 sm:gap-8 border-b pb-3 text-sm sm:text-md font-medium overflow-x-auto">
      {["Description", "Specifications", "Reviews"].map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`pb-2 whitespace-nowrap ${
            tab === t
              ? "text-teal-600 border-b-2 border-teal-600"
              : "text-black"
          }`}
        >
          {t}
        </button>
      ))}
    </div>

    <div className="mt-4 sm:mt-6 text-sm text-gray-700 leading-relaxed">
      {tab === "Description" && (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{
            __html:
              product?.longdescription ||
              product?.description ||
              "<p>No description available.</p>",
          }}
        />
      )}

      {tab === "Specifications" && (
        <div>
          {product?.specifications?.length ? (
            <ul className="space-y-2">
              {product.specifications.map((s, i) => (
                <li key={i} className="flex justify-between border-b pb-2 text-sm">
                  <span className="font-medium text-gray-600">{s.key}</span>
                  <span className="text-gray-800">{s.value}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No specifications available.</p>
          )}
        </div>
      )}

      {tab === "Reviews" && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl sm:text-3xl font-semibold">4.3</div>
            <div className="text-yellow-500 text-lg">★★★★★</div>
            <p className="text-gray-500 text-xs sm:text-sm">(124 reviews)</p>
          </div>
        </div>
      )}
    </div>
  </div>
</div>
  );
}