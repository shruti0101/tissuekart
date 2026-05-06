"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/components/store/cartStore";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCartStore();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [shipping, setShipping] = useState(0);
  const [courier, setCourier] = useState("");
const [isLoggedIn, setIsLoggedIn] = useState(false);


useEffect(() => {
  const token = localStorage.getItem("token");
  setIsLoggedIn(!!token);
}, []);


  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    address: "",
    pincode: "",
  });

  const TOKEN_DISCOUNT = 10;
  const finalAmount = Math.max(0, totalPrice() - TOKEN_DISCOUNT + shipping);

  // 🔐 Auth check
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     toast.error("Please login first");
  //     router.push("/login");
  //   }
  // }, []);

  // 📦 Fetch shipping
  useEffect(() => {
    const fetchShipping = async () => {
      if (form.pincode.length !== 6) return;

      try {
        const res = await fetch(`/api/shipping-rate?pincode=${form.pincode}`);
        const data = await res.json();

        if (data.success) {
          setShipping(data.price);
          setCourier(data.courier);
        } else {
          setShipping(0);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchShipping();
  }, [form.pincode]);

  // Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      email: "",
      city: "",
      state: "",
      address: "",
      pincode: "",
    });
  };

  const validate = () => {
    if (!form.name || !form.phone || !form.address || !form.pincode || !form.city || !form.state) {
      toast.error("Please fill all fields");
      return false;
    }
    return true;
  };

  // ================= MAIN CHECKOUT =================
  const handleCheckout = async () => {
    if (!validate()) return;

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      // ================= COD =================
      if (paymentMethod === "cod") {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            products: cart,
            total: finalAmount,
            shippingCharge: shipping, // ✅ FIXED
            paymentMethod: "cod",
            ...form,
          }),
        });

        const data = await res.json();

        if (data.order) {
          clearCart();
          resetForm();
          router.push(`/order-success?orderId=${data.order.orderId}`);
        } else {
          toast.error("Order failed");
        }

        setLoading(false);
        return;
      }

      // ================= ONLINE =================
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount }),
      });

      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Tissue Kart",
        order_id: order.id,

        handler: async function (response) {
          const verifyRes = await fetch("/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              products: cart,
              total: finalAmount,
              shippingCharge: shipping, 
              paymentMethod: "razorpay",
              ...form,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const data = await verifyRes.json();

          if (data.order) {
            clearCart();
            resetForm();
            router.push(`/order-success?orderId=${data.order.orderId}`);
          } else {
            toast.error("Payment verification failed");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 mt:10 md:mt-30">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT FORM */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">

<div className="flex justify-between items-center mb-2">

          <h2 className="text-xl font-bold mb-4">Customer Details</h2>
          {!isLoggedIn && (
  <Link
    href="/login"
    className="text-md underline text-teal-600 capitalize animate-pulse mb-4"
  >
    sign in to get rewards
  </Link>
)}
</div>

          <div className="space-y-4">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name"
              className="w-full border p-3 rounded-lg" />

            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone"
              className="w-full border p-3 rounded-lg" />

            <input name="email" value={form.email} onChange={handleChange} placeholder="Email"
              className="w-full border p-3 rounded-lg" />
<input
  name="city"
  value={form.city}
  onChange={handleChange}
  placeholder="City"
  className="w-full border p-3 rounded-lg"
/>

<input
  name="state"
  value={form.state}
  onChange={handleChange}
  placeholder="State"
  className="w-full border p-3 rounded-lg"
/>
            <textarea name="address" value={form.address} onChange={handleChange} placeholder="Full Address"
              className="w-full border p-3 rounded-lg" />

            <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pincode"
              className="w-full border p-3 rounded-lg" />
          </div>

          {/* PAYMENT */}
          <h2 className="text-xl font-bold mt-6 mb-4">Payment Method</h2>

          <div className="space-y-3">
            <label className="flex items-center border p-4 rounded-lg cursor-pointer">
              <input type="radio" checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")} />
              <span className="ml-3 text-teal-600 font-semibold">Pay Online</span>
            </label>

            <label className="flex items-center border p-4 rounded-lg cursor-pointer">
              <input type="radio" checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")} />
              <span className="ml-3 font-semibold">Cash on Delivery</span>
            </label>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="mt-6 w-full bg-[#05847b] text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="bg-white p-6 rounded-lg shadow max-h-[400px] overflow-y-auto lg:sticky lg:top-36">

          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          {cart.map((item) => (
            <div key={item.name} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <div className="border-t mt-4 pt-4 flex justify-between">
            <span>Subtotal</span>
            <span>₹{totalPrice()}</span>
          </div>

          <div className="flex justify-between text-teal-600">
            <span>Tissue Token</span>
            <span>- ₹{TOKEN_DISCOUNT}</span>
          </div>


                 <div className="flex justify-between">
  <span>Delivery</span>
  <span>₹{shipping}</span>
</div>

{/* {courier && (
  <p className="text-xs text-gray-500 mt-1">
    Delivery via {courier}
  </p>
)} */}

          <div className="border-t mt-2 pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>₹{finalAmount}</span>
          </div>

   

        </div>
      </div>
    </div>
  );
}