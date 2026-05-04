// test route: /api/test-shiprocket

import { getShiprocketToken } from "@/lib/shiprocket"

export async function GET() {
  try {
    const token = await getShiprocketToken()

    return Response.json({
      success: true,
      token: token ? "✅ Valid" : "❌ Invalid",
    })
  } catch (err) {
    return Response.json({
      success: false,
      error: err.message,
    })
  }
}