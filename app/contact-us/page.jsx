"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Mail, Phone, MapPin, User, Building } from "lucide-react";

export default function ContactPage() {

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = {
      platform: "TissueKart Contact Page",
      platformEmail: "support@tissuekart.com",

      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      phone: formData.get("phone"),
      product: "Website Contact Enquiry",
      place: `${formData.get("city")}, ${formData.get("state")}`,
      message: formData.get("message"),
    };

    if (!data.phone || data.phone.length < 10)
      return toast.error("Enter valid phone number");

    try {

      setLoading(true);

      const res = await axios.post(
        "https://brandbnalo.com/api/form/add",
        data,
        {
          validateStatus: (status) => status >= 200 && status < 500
        }
      );

      if (res.status >= 200 && res.status < 300) {

        setSubmitted(true);
        toast.success("Message sent successfully");

        e.target.reset();

        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      }

    } catch (err) {
      toast.error("Something went wrong");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-10 px-6">

      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-semibold mb-4">
            Contact Us
          </h1>

          <p className="text-gray-900 max-w-2xl mx-auto">
            Have a question about our products or need assistance?
            Our team will be happy to help you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* LEFT SIDE INFO */}
          <div className="space-y-8">

            <div className="flex gap-4">
              <div className="bg-teal-600 text-white p-3 rounded-xl">
                <Mail size={20}/>
              </div>

              <div>
                <h3 className="font-semibold text-lg">Email</h3>
                <p className="text-gray-600">support@tissuekart.com</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-teal-600 text-white p-3 rounded-xl">
                <Phone size={20}/>
              </div>

              <div>
                <h3 className="font-semibold text-lg">Phone</h3>
                <p className="text-gray-600">+91 XXXXX XXXXX</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-teal-600 text-white p-3 rounded-xl">
                <MapPin size={20}/>
              </div>

              <div>
                <h3 className="font-semibold text-lg">Location</h3>
                <p className="text-gray-600">Delhi, India</p>
              </div>
            </div>

          </div>

          {/* CONTACT FORM */}
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">

            {submitted ? (

              <div className="text-center py-10">

                <h2 className="text-2xl font-bold text-green-600">
                  Thank You 🎉
                </h2>

                <p className="text-gray-500 mt-3">
                  Your message has been sent successfully.
                </p>

              </div>

            ) : (

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Name */}
                <div className="input-group">
                  <User size={18}/>
                  <input name="name" required placeholder="Full Name"/>
                </div>

                {/* Email */}
                <div className="input-group">
                  <Mail size={18}/>
                  <input type="email" name="email" required placeholder="Email Address"/>
                </div>

                {/* Company */}
                <div className="input-group">
                  <Building size={18}/>
                  <input name="company" placeholder="Company Name"/>
                </div>

                {/* Phone */}
                <div className="input-group">
                  <Phone size={18}/>
                  <input name="phone" required placeholder="Phone Number"/>
                </div>

                {/* Location */}
                <div className="grid grid-cols-2 gap-4">

                  <input
                    name="state"
                    placeholder="State"
                    className="input"
                  />

                  <input
                    name="city"
                    placeholder="City"
                    className="input"
                  />

                </div>

                {/* Message */}
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Your Message"
                  className="input resize-none"
                />

                <button
                  disabled={loading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-semibold transition"
                >
                  {loading ? "Submitting..." : "Send Message"}
                </button>

              </form>

            )}

          </div>

        </div>

      </div>

      <style jsx>{`

        .input {
          width:100%;
          padding:0.8rem 1rem;
          border-radius:10px;
          border:1px solid #e5e7eb;
          background:#f9fafb;
          outline:none;
        }

        .input:focus {
          border-color:#0f766e;
          background:white;
        }

        .input-group {
          display:flex;
          align-items:center;
          gap:10px;
          border:1px solid #e5e7eb;
          padding:10px 14px;
          border-radius:10px;
          background:#f9fafb;
        }

        .input-group input {
          flex:1;
          border:none;
          outline:none;
          background:transparent;
        }

      `}</style>

    </div>
  );
}