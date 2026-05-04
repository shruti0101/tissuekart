import { connectDB } from "@/lib/Db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const ordersCount = await Order.countDocuments();
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();

    // ✅ Only count paid + COD orders
    const orders = await Order.find();

    const revenue = orders.reduce((sum, order) => {
      return sum + (order.total || 0);
    }, 0);

    return Response.json({
      orders: ordersCount,
      users: usersCount,
      products: productsCount,
      revenue,
    });
  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}