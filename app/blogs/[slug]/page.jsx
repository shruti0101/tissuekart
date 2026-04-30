import React from 'react'
import BlogDetail from './BlogDetails';
import Blog from '@/models/Blog';
import { connectDB } from '@/lib/Db';


export async function generateMetadata({ params }) {
    const { slug } = await params;
    await connectDB();
    const blog = await Blog.findOne({slug });
  
    if (!blog) {
        return {
            title: "Blog Not Found",
            description: "This blog does not exist.",
        };
    }

    return {
        title: blog.metaTitle || blog.title,
        description: blog.metaDescription || "",
        openGraph: {
            title: blog.metaTitle || blog.title,
            description: blog.metaDescription || "",
            images: blog.image ? [{ url: blog.image }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: blog.metaTitle || blog.title,
            description: blog.metaDescription || "",
            images: blog.image ? [blog.image] : [],
        },
    };
}



export default function page() {
  return (
    <><BlogDetail></BlogDetail></>
  )
}
