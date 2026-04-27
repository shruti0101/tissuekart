import Razorpay from "razorpay"

export const runtime = "nodejs" // ✅ IMPORTANT

export async function POST(req) {
  try {
    const { amount } = await req.json()

    if (!amount) {
      return Response.json({ error: "Amount required" }, { status: 400 })
    }

    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET
    })

    const order = await instance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    })

    return Response.json(order)

  } catch (err) {
    console.error("RAZORPAY ERROR:", err) // 👈 CHECK TERMINAL
    return Response.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 }
    )
  }
}