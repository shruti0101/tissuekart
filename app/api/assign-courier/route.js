import { connectDB } from "@/lib/Db";
import Order from "@/models/Order";
import { assignCourier } from "@/lib/shiprocket";

export async function POST(req) {
  try {
    await connectDB();

    const { orderId } = await req.json();

    const order = await Order.findOne({ orderId });

    if (!order || !order.shipment_id) {
      return Response.json({ error: "Shipment not found" }, { status: 404 });
    }

    const courier = await assignCourier(order.shipment_id);

    console.log("🚚 Manual Assign:", courier);

    if (courier?.awb_code) {
      order.awb_code = courier.awb_code;
      order.courier_name = courier.courier_name;
      order.tracking_url = courier.tracking_url || null;

      await order.save();

      return Response.json({ success: true, order });
    }

    return Response.json({
      error: courier?.message || "Assign failed",
    }, { status: 400 });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}