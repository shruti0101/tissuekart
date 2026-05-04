import { connectDB } from "@/lib/Db";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { sendOrderEmail } from "@/lib/sendEmail";
import { createShipment, assignCourier } from "@/lib/shiprocket";

// ================= AUTH =================
const getUser = (req) => {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) return null;

    const token = auth.split(" ")[1];
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

// ================= CREATE ORDER =================
export async function POST(req) {
  await connectDB();

  const user = getUser(req);
  if (!user) {
    return Response.json({ msg: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    products,
    total,
    shippingCharge,
    paymentMethod,
    name,
    email,
    phone,
    address,
    pincode,
    city,
    state,
  } = data;

  // ✅ STRICT VALIDATION (NO FAKE DATA)
  if (!name || !phone || !address || !pincode || !city || !state) {
    return Response.json(
      { msg: "All address fields are required" },
      { status: 400 }
    );
  }

  let paymentStatus = "pending";

  // ================= RAZORPAY VERIFY =================
  if (paymentMethod === "razorpay") {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET) // ✅ FIXED
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return Response.json(
        { msg: "Payment verification failed" },
        { status: 400 }
      );
    }

    paymentStatus = "paid";
  }

  if (paymentMethod === "cod") {
    paymentStatus = "pending";
  }

  // ================= CREATE ORDER =================
  const orderId = `MT-${uuidv4().slice(0, 8)}`;

  const order = await Order.create({
    orderId,
    userId: user.id,
    products,
    total,
    shippingCharge: shippingCharge || 0,
    paymentMethod,
    paymentStatus,
    paymentId: razorpay_payment_id || null,
    razorpayOrderId: razorpay_order_id || null,

    name,
    email,
    phone,
    address,
    pincode,
    city,
    state,

    status: paymentStatus === "paid" ? "paid" : "pending",
  });

  // ================= SHIPROCKET =================
  try {
    if (paymentMethod === "cod" || paymentStatus === "paid") {
      const cleanPhone = String(phone).replace(/\D/g, "").slice(-10);

      const shipmentPayload = {
        order_id: order.orderId,
        order_date: new Date().toISOString().slice(0, 10),

        pickup_location: "Home",

        billing_customer_name: name,
        billing_last_name: "User",
        billing_address: address,
        billing_city: city,
        billing_pincode: pincode,
        billing_state: state,
        billing_country: "India",
        billing_email: email || "test@example.com",
        billing_phone: cleanPhone,

        shipping_is_billing: true,

        order_items: products.map((p) => ({
          name: p.name,
          sku: String(p._id),
          units: Number(p.quantity) || 1,
          selling_price: Number(p.price),
        })),

        payment_method: paymentMethod === "cod" ? "COD" : "Prepaid",

        // exclude shipping from subtotal
        sub_total: Number(total) - Number(shippingCharge || 0),

        length: 10,
        breadth: 10,
        height: 10,
        weight: 0.5,
      };

      console.log(" FINAL PAYLOAD:", shipmentPayload);

      const shipment = await createShipment(shipmentPayload);

        if (shipment?.shipment_id) {
      order.shipment_id = shipment.shipment_id;

      
      try {
        const courier = await assignCourier(shipment.shipment_id);

        console.log(" Courier Assign Response:", courier);

        if (courier?.awb_code) {
          order.awb_code = courier.awb_code;
          order.courier_name = courier.courier_name;
          order.tracking_url = courier.tracking_url || null;
        } else {
          // ⚠️ Wallet empty or failed → don't break
          console.warn("Courier not assigned (manual assign later)");
        }

      } catch (err) {
        console.error(" Assign failed:", err.message);
      }

      await order.save();
    }
  }
} catch (err) {
  console.error("Shiprocket Error:", err.message);
}

  // ================= EMAIL =================
  try {
    if (email) {
      await sendOrderEmail({ to: email, order });
    }
  } catch (err) {
    console.error("Email failed:", err.message);
  }

  return Response.json({
    msg: "Order placed successfully",
    order,
  });
}

// ================= GET ORDERS =================
export async function GET(req) {
  await connectDB();

  const user = getUser(req);

  if (!user) {
    return Response.json({ msg: "Unauthorized" }, { status: 401 });
  }

  let orders;

  if (user.role === "admin") {
    orders = await Order.find().sort({ createdAt: -1 });
  } else {
    orders = await Order.find({ userId: user.id }).sort({
      createdAt: -1,
    });
  }

  return Response.json(orders);
}