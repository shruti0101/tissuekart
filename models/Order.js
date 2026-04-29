import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },

  userId: {
    type: String,
    required: true
  },

  products: [
    {
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],

  total: {
    type: Number,
    required: true
  },

  // ✅ CUSTOMER DETAILS (ADD THIS)
  name: String,
  email: String,
  phone: String,
  address: String,
  pincode: String,

  // PAYMENT
  paymentMethod: String,
  paymentStatus: String,

  paymentId: String,
  razorpayOrderId: String,

  status: {
    type: String,
    enum: ["pending", "paid", "failed", "shipped", "delivered"],
    default: "pending"
  }

}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);