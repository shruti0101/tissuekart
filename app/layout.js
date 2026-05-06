import { Caladea } from "next/font/google";
import "./globals.css";

import CartDrawer from "@/components/cartDrawer";
import { Toaster } from "react-hot-toast";
import LayoutWrapper from "@/components/Layoutwrapper";

const caladea = Caladea({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-caladea",
});


export const metadata = {
  title: "Matrix Tissue | Face Tissue, Paper Napkin, Kitchen Towel, Toilet Roll, Butter Paper Roll",
  description:
    "Matrix Tissue offers premium Face Tissue, Paper Napkin, Kitchen Towel, Toilet Roll, Butter Paper Roll, and Cake Box solutions for homes, hotels, restaurants, and businesses at competitive prices.",

  icons: {
    icon: "/favicon.ico", 
    shortcut: "/favicon.ico",
 
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={caladea.variable}>
      <body className="font-serif antialiased">

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0f172a",
              color: "#fff",
            },
          }}
        />

        <LayoutWrapper>
          {children}
        </LayoutWrapper>

        <CartDrawer />
      </body>
    </html>
  );
}