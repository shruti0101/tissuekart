"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
export default function AdminPage(){

  const router = useRouter()
 const [orders,setOrders] = useState([])

useEffect(() => {

  const user = JSON.parse(localStorage.getItem("user"))

  if (!user || user.role !== "admin") {
    router.push("/login")
    return
  }

  const token = localStorage.getItem("token")

  fetch("/api/orders", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) setOrders(data)
      else setOrders([])
    })

}, [])

  return (
  
  <div className="p-10">

      <h1 className="text-3xl font-semibold mb-8">
        All Orders
      </h1>

      {orders.map(order => (

        <div key={order._id} className="border p-5 mb-4 rounded-lg">

          <p>User: {order.userId}</p>
          <p>Total: ₹{order.total}</p>
          
          <p>Products:</p>

          <p>Status: {order.status}</p>

        </div>

      ))}

      <Link href="/admin/products">
  <button className="bg-blue-600 text-white px-5 py-2 rounded mr-3">
    View Products
  </button>
</Link>


<Link href="/admin/add-product">
  <button className="mb-6 bg-black text-white px-5 py-2 rounded">
    + Add Product
  </button>
</Link>
    </div>
  )
}
