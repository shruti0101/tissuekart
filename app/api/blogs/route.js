import { connectDB } from "@/lib/Db"
import Blog from "@/models/Blog"
import { uploadToR2 } from "@/utils/uploadToR2";

// GET all blogs
export async function GET() {
  await connectDB()

  const blogs = await Blog.find().sort({ createdAt: -1 })
  console.log(blogs);

  return Response.json(blogs)
}

export async function POST(req) {
 try {
    await connectDB();

    // ✅ get form data
    const formData = await req.formData();

    const title = formData.get("title");
    const slug = formData.get("slug");
    const content = formData.get("content");
    const metaTitle = formData.get("metaTitle");
    const metaDescription = formData.get("metaDescription");
    const date = formData.get("date");
    const file = formData.get("image");

    let imageUrl = "";
    let imageFileId = ""; // ✅ FIXED

    if (file && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${file.name}`;

      const resUpload = await uploadToR2({
        file: buffer,
        folder: "tissueKart",
        fileName,
        contentType: file.type,
      });

      imageUrl = resUpload.url;
      imageFileId = resUpload.key; 
    }


    // ✅ save in DB
    const blog = await Blog.create({
      title,
      slug,
      content,
      metaTitle,
      metaDescription,
      date: date ? new Date(date) : new Date(),
      image: imageUrl,
      imageFileId
    });

    return Response.json({
      msg: "Blog created",
      blog,
    });

  } catch (err) {
    console.error(err);
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }

}

//delete blog 
export async function DELETE(req){
  await connectDB();
  const { id } = await req.json();
  const deletedBlog = await Blog.findByIdAndDelete(id);

   if (!deletedBlog) {
      return Response.json({ msg: "Blog not found" }, { status: 404 });
    }

    return Response.json({
      msg: "Blog deleted successfully",
      deletedBlog,
    });
}

