"use client";
import React from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";

export default function PopupForm({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      platform: "tissuekart landing page Form",
      platformEmail: "matrixtissues@gmail.com",
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      product: formData.get("machine"),
      place: "N/A",
      message: formData.get("message"),
    };

    if (!data.phone || data.phone.toString().length < 10) {
      return toast.error("Enter Valid Phone Number");
    }

    try {
      await axios.post("https://brandbnalo.com/api/form/add", data);
      toast.success("Message Sent Successfully");
      e.target.reset();
      handleClose(); // close after submit
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  const formcategory = [
    "Face Tissue",
    "Paper Napkin",
    "Kitchen Towel",
    "Toilet Roll",
    "Butter Paper Roll",
    "Cake Box",
  ];

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 px-3 sm:px-4">
      <div className="relative w-full max-w-[900px] bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] animate-[popup_0.25s_ease-out]">

        <button
          onClick={handleClose}
          className="absolute right-3 top-3 z-50 h-9 w-9 rounded-full bg-white shadow grid place-items-center text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          <div className="relative hidden md:block">
            <Image src="/collection/2.webp" alt="Enquiry" fill priority className="object-cover" />
            <div className="absolute inset-0  p-6 flex flex-col justify-end">
              <h3 className="text-white text-xl lg:text-2xl font-bold">Get a Free Quote in Minutes</h3>
              <p className="text-white/90 text-sm mt-2">Share your requirement and get best pricing & details.</p>
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8 overflow-y-auto">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center">
              Get Your <span className="text-teal-700">Free Quote</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 mt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" name="name" required placeholder="Full Name*" className="input" />
                <input type="tel" name="phone" required placeholder="Mobile Number*" className="input" />
              </div>

              <input type="email" name="email" required placeholder="Email Address*" className="input" />

              <select name="machine" required className="input">
                <option value="">Select Product*</option>
                {formcategory.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <textarea name="message" rows={3} placeholder="Message" className="input resize-none" />

              <button type="submit" className="w-full bg-teal-700 hover:bg-teal-600 text-white py-3 rounded-xl font-semibold transition">
                Send My Enquiry →
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes popup {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .input {
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          outline: none;
        }
        .input:focus {
          border-color: #2563eb;
          background: #fff;
        }
      `}</style>
    </div>
  );
}
