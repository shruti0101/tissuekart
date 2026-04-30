import React from 'react'
import Link from "next/link";

const AdminPannel = () => {
  return (
    <>
     <aside className="w-64 bg-[#020617] border-r border-white/10 p-6 flex flex-col justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-8 gap-5 text-orange-500">
                  Admin Panel
                </h1>
    
                <nav>
                  <Link
                    href="/admin/blogs/newblog"
                    className="w-full inline-flex items-center justify-center gap-2 
                     bg-orange-500 hover:bg-orange-600 
                     text-white font-semibold 
                     py-2.5 px-4 rounded-xl 
                     transition-all duration-200 
                     shadow-sm hover:shadow-md 
                     mb-6"
                  >
                    <span className="text-lg">+</span>
                    <span>New Blog</span>
                  </Link>
                </nav>
    
                <nav className="flex flex-col gap-3">
                  <Link href={"/admin/blogs"} className="text-center px-3 py-2 rounded-lg text-white bg-white/5 hover:bg-white/10">
                    All Blogs
                  </Link>
                </nav>
              </div>
    
            </aside>
    </>
  )
}

export default AdminPannel