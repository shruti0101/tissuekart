"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "./Footer";
export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const hideNavbarRoutes = ["/login","/register", "/dashboard" , "/admin", "/admin/dashboard"];
const hideFooterRoutes = ["/login", "/register", "/dashboard" , "/admin", "/admin/dashboard"];
  const shouldHideNavbar = hideNavbarRoutes.includes(pathname);
  const shouldHideFooter = hideFooterRoutes.includes(pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {children}
      {!shouldHideFooter && <Footer />}
    </>
  );
}

