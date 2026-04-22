// models/Blog.js

import mongoose from "mongoose"

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  metaTitle: String,
  metaDescription: String,
  slug: String,
  image: String
}, { timestamps: true })

export default mongoose.model("Blog", blogSchema)