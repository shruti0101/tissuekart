"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "./Footer";
export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const hideNavbarRoutes = ["/login","/register", "/dashboard" , "/admin", "/admin/dashboard","/admin/blogs/",];

const hideFooterRoutes = ["/login", "/register", "/dashboard" , "/admin", "/admin/dashboard,/admin/blogs/"];

const shouldHideNavbar =
  hideNavbarRoutes.includes(pathname) ||
  pathname.startsWith("/admin");

const shouldHideFooter =
  hideFooterRoutes.includes(pathname) ||
  pathname.startsWith("/admin");

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {children}
      {!shouldHideFooter && <Footer />}
    </>
  );
}

