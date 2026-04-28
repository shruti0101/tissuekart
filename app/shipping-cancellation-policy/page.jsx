"use client"

import { RotateCcw, AlertTriangle, XCircle, Phone, Mail } from "lucide-react"

export default function ReturnRefundPolicy() {

  return (

    <section className="bg-[#f8fafc] py-5 md:py-20 px-6 mt-8 md:mt-30">

      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-5 md:mb-16">

          <h1 className="text-4xl font-semibold mb-4">
            Shipping & Cancellations Policy
          </h1>

          <p className="text-gray-500">
            Please read our policy carefully before requesting a return or replacement.
          </p>

        </div>


        <div className="space-y-8">

          {/* Return Policy */}
          <div className="bg-white p-4 md:p-8 rounded-xl shadow-sm border">

            <div className="flex items-center gap-3 mb-4">

              <RotateCcw className="text-[#129c97]" size={26} />

              <h2 className="text-xl font-semibold">
                Can I return an item ordered from Matrix Tissue?
              </h2>

            </div>

            <p className="text-gray-600 leading-relaxed">

              All sales are generally <b>non-returnable and non-refundable</b>. However,
              if you receive a <b>damaged, defective, or incorrect product</b>, you may
              request a <b>replacement (not a refund)</b> by contacting us within
              <b> 48 hours of delivery</b>.

            </p>

            <p className="text-gray-600 mt-4">

              The item must be <b>unused</b>, in its <b>original condition</b>, and must
              include all <b>original packaging materials</b>.

            </p>

          </div>


          {/* Refund Policy */}
          <div className="bg-white p-4 md:p-8 rounded-xl shadow-sm border">

            <div className="flex items-center gap-3 mb-4">

              <AlertTriangle className="text-[#129c97]" size={26} />

              <h2 className="text-xl font-semibold">
                Is there a refund option?
              </h2>

            </div>

            <p className="text-gray-600 leading-relaxed">

              We currently <b>do not offer refunds</b> for any purchases.
              Only <b>replacement requests</b> are accepted in case of
              verified <b>damaged, defective, or incorrect items</b>.

            </p>

          </div>


          {/* Cancellation Policy */}
          <div className="bg-white p-4 md:p-8 rounded-xl shadow-sm border">

            <div className="flex items-center gap-3 mb-4">

              <XCircle className="text-[#129c97]" size={26} />

              <h2 className="text-xl font-semibold">
                Can I cancel my order?
              </h2>

            </div>

            <p className="text-gray-600 leading-relaxed">

              Orders can be cancelled within <b>24 hours of placing the order</b>,
              only if the order has <b>not been dispatched</b>.

            </p>

            <p className="text-gray-600 mt-4">

              Once the order has been shipped, <b>cancellations or refunds are
              not possible</b>.

            </p>

          </div>


          {/* Contact */}
          <div className="bg-[#129c97] text-white p-4 md:p-8 rounded-xl shadow-lg">

            <h2 className="text-xl font-semibold mb-6">
              Contact Us
            </h2>

            <p className="opacity-90 mb-6">
              For replacement or cancellation requests, please reach out to us:
            </p>

            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <Mail size={20}/>
                <span>matrixtissues@gmail.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={20}/>
                <span>+91-8810540823</span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>

  )
}