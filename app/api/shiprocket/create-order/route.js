export async function createShiprocketOrder(orderData) {
  try {
    const token = await getShiprocketToken()

    const res = await fetch(
      `${process.env.SHIPROCKET_API_URL}/orders/create/adhoc`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      console.error("❌ Shiprocket Order Error:", data)
      throw new Error("Order creation failed")
    }

    console.log("✅ Shiprocket Order Created:", data)
    return data
  } catch (err) {
    console.error("Create Shipment Error:", err.message)
    return null
  }
}