import React from "react";

export default function Page() {
  return (
    <div className="mt-10 md:mt-38 max-w-5xl mx-auto py-2 px-6 bg-white shadow-md rounded my-10">

      <h1 className="text-3xl font-bold mb-6 text-center">
        Return & Refund Policy
      </h1>

      {/* SECTION 1 */}
      <h2 className="text-2xl font-semibold mb-3">
        Can I return an item ordered from Matrix Tissue?
      </h2>

      <p className="mb-4 text-md">
        All sales are generally non-returnable and non-refundable. However, if you
        receive a damaged, defective, or incorrect product, you may request a{" "}
        <strong>replacement (not a refund)</strong> by contacting us within{" "}
        <strong>48 hours of delivery</strong>.
      </p>

      <p className="mb-4 text-md">
        The item must be unused, in original condition, and include all packaging
        materials.
      </p>

      {/* SECTION 2 */}
      <h2 className="text-2xl font-semibold mb-3">
        Is there a refund option?
      </h2>

      <p className="mb-4 text-md">
        We do not offer refunds for any purchases. Only replacement requests are
        accepted in case of verified damaged, defective, or incorrect items.
      </p>

      {/* SECTION 3 */}
      <h2 className="text-2xl font-semibold mb-3">
        Can I cancel my order?
      </h2>

      <p className="mb-4 text-md">
        Orders can be canceled within <strong>24 hours</strong> of placing the
        order, only if the order has not been dispatched. Once the order is
        shipped, cancellations or refunds are not possible.
      </p>

      {/* SECTION 4 */}
      <h2 className="text-2xl font-semibold mb-3">
        Contact Us
      </h2>

      <p className="mb-2 text-md">
        For replacement or cancellation requests, contact us:
      </p>

      <p className="text-md">
        <strong>Email:</strong> matrixtissues@gmail.com <br />
        <strong>Phone:</strong> +91-8810540823
      </p>

    </div>
  );
}