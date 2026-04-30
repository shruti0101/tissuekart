import { connectDB } from "@/lib/Db"
import Blog from "@/models/Blog"
import { deleteFromR2 } from "@/utils/deleteFromR2";
import { uploadToR2 } from "@/utils/uploadToR2";


// GET single blog by slug
export async function GET(req, { params }) {
  try {
    const { slug } = await params;

    await connectDB();

    const blog = await Blog.findOne( {slug} );

    if (!blog) {
      return Response.json({ msg: "Blog not found" }, { status: 404 });
    }

    return Response.json(blog);
  } catch (error) {
    return Response.json(
      { msg: "Error fetching blog", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { slug } = await params;

    const formData = await req.formData();

    const existing = await Blog.findOne({ slug });
    if (!existing) {
      return Response.json({ msg: "Blog not found" }, { status: 404 });
    }

    // ✅ Normal fields
    const data = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      metaTitle: formData.get("metaTitle"),
      metaDescription: formData.get("metaDescription"),
      content: formData.get("content"),
      date: formData.get("date"),
    };

    const newFile = formData.get("image");

    // ✅ Image handling
    if (newFile && newFile.name) {
      if (existing.imageFileId) {
        await deleteFromR2(existing.imageFileId);
      }

      const bytes = await newFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${newFile.name}`;

      const uploadRes = await uploadToR2({
        file: buffer,
        folder: "genzeeSwitchgears",
        fileName,
        contentType: newFile.type,
      });

      data.image = uploadRes.url;
      data.imageFileId = uploadRes.key;
    }

    const updatedBlog = await Blog.findOneAndUpdate(
      { slug },
      data,
      { new: true }
    );

    return Response.json({
      msg: "Blog updated successfully",
      blog: updatedBlog,
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      {
        msg: "Error updating blog",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
