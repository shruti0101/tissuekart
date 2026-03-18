import { Caladea } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/cartDrawer";
import { Toaster } from "react-hot-toast"

const caladea = Caladea({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-caladea",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${caladea.variable} ${caladea.className}`}>
      <body className="antialiased">

        <Navbar />
  <Toaster
    position="top-right"
    toastOptions={{
      style: {
        background: "#0f172a",
        color: "#fff",
      },
    }}
  />
     
          {children}
     

        <CartDrawer />
        <Footer />

      </body>
    </html>
  );
}