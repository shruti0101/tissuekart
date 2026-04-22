import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  slug: String,

  price: Number,
  oldPrice: Number, // 🔥 discount price

  description: String,
  features: [String], // 🔥 bullet points

  longdescription: {
    type: String,
    default: "",
  },



  specifications: [
    {
      key: String,
      value: String,
    }
  ], // 🔥 NEW

  images: [String],

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },

  stock: {
    type: Boolean,
    default: true,
  },

  rating: {
    type: Number,
    default: 4,
  },

  reviewsCount: {
    type: Number,
    default: 10,
  },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);