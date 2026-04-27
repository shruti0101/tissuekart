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
  const [tab, setTab] = useState("description");

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
    <div className="w-full mx-auto px-15 py-10 font-serif">

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        Home / {product.category?.name || "Category"} / {product.name}
      </div>

      <div className="grid md:grid-cols-2 gap-15">

        {/* Images */}
        <div>
          <div className="shadow-sm rounded-md overflow-hidden border h-[560px] border-gray-300">
            <Image
              src={activeImage}
              alt={product.name}
              width={1000}
              height={800}
              className="mx-auto object-cover"
            />
          </div>

          <div className="flex gap-3 mt-4">
            {product.images?.map((img, i) => (
              <div
                key={i}
                onClick={() => setActiveImage(img)}
                className="border p-1 rounded cursor-pointer"
              >
                <Image src={img} width={70} height={70} alt="" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-gray-500 text-sm">
            {product.category?.name}
          </p>

          <h1 className="text-3xl  font-semibold mt-1">
            {product.name}
          </h1>

   {/* RATING */}
          <div className="flex items-center gap-2 mt-3">
            <div className="text-yellow-500 text-sm">⭐⭐⭐⭐☆</div>
            <span className="text-gray-400 text-sm">
              ({product.reviewsCount} reviews)
            </span>
          </div>

          <div className="flex items-center gap-4 mt-5">
            <span className="text-3xl font-bold">
              ₹{product.price}
            </span>

            {product.oldPrice > 0 && (
              <>
                <span className="line-through text-gray-400">
                  ₹{product.oldPrice}
                </span>

                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>


              {/* STOCK */}
          <p className="mt-3 text-sm">
            <span className="text-gray-500">Availability: </span>
            <span
              className={`font-medium ${
                product.stock ? "text-green-600" : "text-red-500"
              }`}
            >
              {product.stock ? "In Stock" : "Out of Stock"}
            </span>
          </p>

          <p className="text-red-500 font-serif mt-2">Inclusive of all taxes</p>

          {/* SHORT DESCRIPTION */}
          <p className="mt-3 text-black text-md leading-relaxed">
            {product.description}
          </p>

     {/* FEATURES */}
<ul className="mt-5 font-bold space-y-1 text-lg font-serif text-black bg-[#F0FDFA] p-4 rounded">
  {product.features?.map((f, i) => (
    <li key={i} className="flex items-start gap-2">
      <Check className="w-5 h-5 font-serif text-black mt-[3px]" />
      <span>{f}</span>
    </li>
  ))}
</ul>

          {/* Quantity */}
          <div className="mt-6">
            <p className="font-medium mb-3">Quantity</p>

            <div className="flex items-center px-4 py-2 bg-gray-100 gap-4 border w-max rounded">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 mt-6">
            <button
              onClick={addToCart}
              className="bg-[#129c97] px-40 py-3 rounded-lg text-white font-semibold"
            >
              ADD TO CART
            </button>

               <button
              onClick={handleWishlist}
              className="flex items-center text-lg gap-2"
            >
              <Heart size={25} fill={inWishlist ? "red" : "none"} />
              Add To Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex gap-10 border-b pb-3">
          {["Description", "Specifications", "Reviews"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={tab === t ? "text-teal-600 border-b-2 border-teal-600" : ""}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "Description" && (
            <div
              dangerouslySetInnerHTML={{
                __html: product.longdescription || product.description || "",
              }}
            />
          )}

          {tab === "Specifications" && (
            <ul>
              {product.specifications?.map((s, i) => (
                <li key={i}>
                  {s.key}: {s.value}
                </li>
              ))}
            </ul>
          )}

          {tab === "Reviews" && <p>No reviews yet.</p>}
        </div>
      </div>
    </div>
  );
}