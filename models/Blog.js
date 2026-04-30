// models/Blog.js

import mongoose from "mongoose"

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  metaTitle: String,
  metaDescription: String,
  slug: String,
  image: String,
  date: {
    type: Date,
    required: true,
    default: Date.now, 
  },
  imageFileId:String    
}, { timestamps: true })

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;