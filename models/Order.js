// models/Order.js

import mongoose from "mongoose"

const OrderSchema = new mongoose.Schema({

     orderId: {
    type: String,
    required: true,
    unique: true
  },
  userId: String,
  products: [
    {
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  total: Number,

}, { timestamps: true })

export default mongoose.models.Order || mongoose.model("Order", OrderSchema)