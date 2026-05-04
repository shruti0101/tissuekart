"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
export default function LoginPage() {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.msg || "Login failed")
      return
    }

    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))

if (data.user.role === "admin") {
  router.push("/admin")
} else {
  router.push("/checkout")
}

  }

  return (

 <section className="bg-white mt-10 md:mt-32" >


    <div className="h-[60vh] flex items-center justify-center ">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-5">

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center">
          Welcome Back 👋
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-[#129c97] text-white py-3 rounded-lg font-semibold hover:bg-[#0f7d79] transition"
        >
          Login
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Register Button */}
        <Link href="/register">
          <button className="w-full border py-3 rounded-lg font-medium hover:bg-gray-100 transition">
            Create New Account
          </button>
        </Link>

        <Link href="/" className="flex justify-center items-center">

<button className="bg-black  text-white px-9 cursor-pointer text-base font-semibold rounded-sm capitalize  py-3 mt-4 ">back to home</button>
        </Link>
      </div>   
   

    </div>
 </section>



  )
}