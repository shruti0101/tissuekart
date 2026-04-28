"use client";
import React from "react";

export default function Page() {
  return (
    <>
      {/* HEADER */}
      <header className="py-8 md:py-10 bg-teal-100 mt-20 md:mt-35">
        <div className="container mx-auto px-4">
          <nav className="text-gray-600 text-base sm:text-lg mb-3 text-center">
            <ol className="list-reset inline-flex flex-wrap justify-center items-center">
              <li>
                <a
                  href="/"
                  className="hover:text-[#1b7677] font-medium transition-colors duration-200"
                >
                  Home
                </a>
              </li>
              <li><span className="mx-2 text-gray-400">/</span></li>
              <li className="text-gray-800 font-semibold">
                Terms & Conditions
              </li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-900">
            Terms & Conditions
          </h1>

          <p className="text-center text-gray-600 mt-3 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Please read these terms carefully before using TissueKart services.
          </p>
        </div>
      </header>

      {/* CONTENT */}
      <section className="max-w-5xl mx-auto  md:py-4 px-6 bg-white shadow-md rounded my-7 text-gray-800">

        <h2 className="text-2xl font-semibold mb-2">
          1. Introduction
        </h2>
        <p className="mb-4">
          Welcome to <strong>TissueKart</strong>. By accessing or using our website,
          you agree to comply with and be bound by the following terms and conditions.
        </p>

        <h2 className="text-2xl font-semibold mb-3">
          2. Use of Website
        </h2>
        <p className="mb-4">
          You agree to use this website only for lawful purposes and in a way
          that does not infringe the rights of others or restrict their use.
        </p>

        <h2 className="text-2xl font-semibold mb-3">
          3. Product Information
        </h2>
        <p className="mb-4">
          We strive to ensure that all product details, pricing, and images are
          accurate. However, TissueKart reserves the right to modify or update
          information at any time without prior notice.
        </p>

        <h2 className="text-2xl font-semibold mb-3">
          4. Orders & Payments
        </h2>
        <p className="mb-4">
          All orders placed through the website are subject to acceptance and availability.
          We reserve the right to cancel or refuse any order at our discretion.
        </p>

        <h2 className="text-2xl font-semibold mb-3">
          5. Shipping & Delivery
        </h2>
        <p className="mb-4">
          Delivery timelines are estimates and may vary depending on location
          and external factors. TissueKart is not liable for delays caused by
          courier or unforeseen circumstances.
        </p>

        <h2 className="text-2xl font-semibold mb-3">
          6. Returns & Replacement
        </h2>
        <p className="mb-4">
          Products are eligible for replacement only in case of damaged,
          defective, or incorrect items, as per our Return & Refund Policy.
        </p>

        <h2 className="text-2xl font-semibold mb-3">
          7. User Accounts
        </h2>
        <p className="mb-4">
          You are responsible for maintaining the confidentiality of your account
          and password. TissueKart is not responsible for unauthorized access.
        </p>

        <h2 className="text-2xl font-semibold mb-3">
          8. Intellectual Property
        </h2>
        <p className="mb-4">
          All content on this website including text, images, logos, and design
          is the property of TissueKart and may not be used without permission.
        </p>

        <h2 className="text-2xl font-semibold mb-3">
          9. Limitation of Liability
        </h2>
        <p className="mb-4">
          TissueKart shall not be held liable for any indirect or consequential
          damages arising from the use of our website or products.
        </p>

        <h2 className="text-2xl font-semibold mb-3">
          10. Changes to Terms
        </h2>
        <p className="mb-4">
          We reserve the right to update these terms at any time. Continued use
          of the website means you accept the updated terms.
        </p>

        <h2 className="text-2xl font-semibold mb-3">
          11. Contact Us
        </h2>
        <p className="mb-2">
          If you have any questions about these Terms & Conditions, contact us:
        </p>

        <p>
          <strong>Email:</strong> support@tissuekart.com <br />
          <strong>Phone:</strong> +91-XXXXXXXXXX
        </p>

      </section>
    </>
  );
}