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