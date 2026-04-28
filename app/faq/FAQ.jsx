"use client";
import React from "react";
import Link from "next/link";

export default function FAQ() {
  const faqData = [
    {
      q: "How long is the order processing time ?",
      a: "We usually dispatch orders within 24 hours.",
    },
    {
      q: " How do I make an exchange or return ?",
      a: "Please visit our  Return & Exchange Policy section.",
    },
    {
      q: "What kinds of payment methods do you accept ?",
      a: "Credit Card, Debit Card, Net Banking, UPI, PayPal, NEFT, Bank Transfer.",
    },
    {
      q: "Can I return or exchange a product ?",
      a: "Yes, eligible items can be returned or exchanged within 7 days of delivery. Please refer to our Return & Refund Policy for details.",
    },
    {
      q: "Do you offer bulk or wholesale pricing ?",
      a: "Absolutely! We supply to hotels, restaurants, and distributors at competitive wholesale rates. Please contact us directly for bulk inquiries.",
    },
    {
      q: "How can I contact customer support ?",
      a: "You can reach our support team via email at matrixtissues@gmail.com or call us at +91-8810540823. We’re happy to assist you with any queries or concerns.",
    },
  ];

  return (
    <>
      {/* HEADER */}
      <header className="py-8 md:py-10 bg-teal-100">
        <div className="container mx-auto px-4">

          {/* Breadcrumb */}
          <nav className="text-gray-600 text-base sm:text-lg mb-3 text-center">
            <ol className="inline-flex flex-wrap justify-center items-center">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#1b7677] font-medium transition-colors duration-200"
                >
                  Home
                </Link>
              </li>

              <li>
                <span className="mx-2 text-gray-400">/</span>
              </li>

              <li className="text-gray-800 font-semibold">
                FAQ
              </li>
            </ol>
          </nav>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-900">
            Frequently Asked Questions
          </h1>

          {/* Subtitle */}
          <p className="text-center text-gray-600 mt-3 max-w-2xl mx-auto md:text-sm text-md leading-relaxed">
            Find answers to common questions about our products, delivery, and support.
          </p>
        </div>
      </header>

      {/* FAQ SECTION */}
      <section className="max-w-5xl mx-auto my-5 md:py-12 px-6 bg-white shadow-md rounded ">
        <div className="space-y-4">
          {faqData.map((item, i) => (
            <details
              key={i}
              className="p-3 active:scale-102 md:p-5 border rounded-md hover:shadow-sm transition-all hover:scale-105 duration-200 transition-all"
            >
              <summary className="cursor-pointer text-lg font-semibold text-gray-900">
                {i + 1}. {item.q}
              </summary>

              <p className="mt-2 text-gray-700 leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}