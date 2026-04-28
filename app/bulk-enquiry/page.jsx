"use client"

import { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"

export default function BulkEnquiryForm() {

  const [loading,setLoading] = useState(false)
  const [submitted,setSubmitted] = useState(false)

  const handleSubmit = async (e) => {

    e.preventDefault()

    const formData = new FormData(e.target)

    const data = {

      platform: "Matrix Tissue Bulk Enquiry",
      platformEmail: "sales@matrixtissue.com",

      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      company: formData.get("company"),
      product: formData.get("category"),
      place: "Bulk Enquiry",
      message: formData.get("message")

    }

    if (!data.phone || data.phone.length < 10)
      return toast.error("Enter valid phone number")

    try {

      setLoading(true)

      const res = await axios.post(
        "https://brandbnalo.com/api/form/add",
        data,
        { validateStatus: (status)=>status>=200 && status<500 }
      )

      if(res.status >= 200 && res.status < 300){

        setSubmitted(true)
        e.target.reset()

        setTimeout(()=>{
          setSubmitted(false)
        },3000)

      }

    } catch(err){

      toast.error("Something went wrong")

    } finally {
      setLoading(false)
    }

  }

  return (

    <div className="bg-gray-50 py-20 px-6 mt-7 md:mt-20">

      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-lg">

        {submitted ? (

          <div className="text-center py-10">

            <h2 className="text-2xl font-semibold text-green-600">
              Thank You!
            </h2>

            <p className="text-gray-600 mt-2">
              Your bulk enquiry has been submitted successfully.
            </p>

          </div>

        ) : (

        <>
        <h2 className="text-3xl font-semibold mb-2 text-center">
          Bulk Enquiry
        </h2>

        <p className="text-gray-500 text-center mb-10">
          Fill the form below and our team will contact you shortly.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="text-sm font-medium">Name *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Enter your full name"
              className="input"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email *</label>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email address"
              className="input"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium">Phone *</label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="Enter your phone number"
              className="input"
            />
          </div>

          {/* Company */}
          <div>
            <label className="text-sm font-medium">Company</label>
            <input
              type="text"
              name="company"
              placeholder="Your company name (optional)"
              className="input"
            />
          </div>

          {/* Product Category */}
          <div>
            <label className="text-sm font-medium">
              Product Category *
            </label>

            <select
              name="category"
              required
              className="input"
            >
              <option value="">Select Category</option>
              <option>Face Tissue</option>
              <option>Paper Napkin</option>
              <option>Kitchen Towel</option>
              <option>Toilet Roll</option>
              <option>Butter Paper Roll</option>
              <option>Cake Box</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium">Message</label>
            <textarea
              name="message"
              rows="4"
              placeholder="Write your enquiry"
              className="input resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#129c97] text-white py-3 rounded-xl font-medium hover:bg-[#0f7d79] transition"
          >
            {loading ? "Submitting..." : "Submit Enquiry"}
          </button>

        </form>
        </>
        )}

      </div>

      <style jsx>{`

        .input{
          width:100%;
          margin-top:6px;
          padding:12px 14px;
          border-radius:10px;
          border:1px solid #e5e7eb;
          background:#f9fafb;
          outline:none;
        }

        .input:focus{
          border-color:#129c97;
          background:#fff;
        }

      `}</style>

    </div>

  )

}