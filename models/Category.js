import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  image: String,
});

// ✅ FIXED
export default mongoose.models.Category || mongoose.model("Category", CategorySchema);