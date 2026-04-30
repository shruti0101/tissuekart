import React from 'react'
import { Instagram, Facebook, Youtube } from 'lucide-react'

const Footer = () => {
  return (
    <div>
      <footer className="w-full text-white relative">
        {/* Background */}
        <div className="absolute inset-0 bg-[url('/footer.webp')] bg-cover bg-center"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 text-center">

          {/* 🔹 Top Links */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-center gap-y-3 gap-x-8 text-[15px] sm:text-[17px] font-medium mb-8">
            {[
              { label: "About Us", href: "/about-us" },
              { label: "Frequently Asked Questions", href: "/faq" },
              { label: "Return & Refund Policy", href: "return-refund" },
              { label: "Shipping & Cancellations", href: "/shipping-cancellation-policy" },
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms & Conditions", href: "/terms-conditions" },
              { label: "Contact Us", href: "/contact-us" },
              { label: "Our Blog", href: "/blogs" },
              { label: "Bulk Enquiry", href: "/bulk-enquiry" },
              { label: "Whatsapp", href: "https://wa.me/+918810540823" },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                className="hover:text-yellow-400 transition hover:underline text-center"
                target={item.href.startsWith("http") ? "_blank" : "_self"}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : ""}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* 🔹 Social Icons */}
          <div className="flex justify-center gap-5 sm:gap-6 mb-10">
            <a href="https://www.instagram.com/papyrusbymatrixtissues/" className="w-10 h-10 rounded-full bg-white text-teal-900 flex items-center justify-center hover:scale-110 transition">
              <Instagram />
            </a>
            <a href="https://www.facebook.com/Matrix.Tissues/" className="w-10 h-10 rounded-full bg-white text-teal-900 flex items-center justify-center hover:scale-110 transition">
              <Facebook />
            </a>
            <a href="https://www.youtube.com/@papyrusbymatrixtissues" className="w-10 h-10 rounded-full bg-white text-teal-900 flex items-center justify-center hover:scale-110 transition">
              <Youtube />
            </a>
          </div>

          {/* Divider */}
          <div className="border-t border-white mb-6"></div>

          {/* 🔹 Bottom Bar */}
          <div className="flex flex-col items-center justify-center text-sm text-center gap-2 md:flex-row md:justify-between md:text-left">
            <p>© 2025 Tissue Kart. All Rights Reserved.</p>
            <p>
              <a href='https://promozionebranding.com/' className="text-yellow-400 hover:underline font-semibold">
                Website Designing Company
              </a>{" "}
              Website Designed By Promozione Branding Pvt. Ltd
            </p>
          </div>

        </div>
      </footer>
    </div>
  )
}

export default Footer
