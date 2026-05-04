let shiprocketToken = null;
let tokenExpiry = null;
let isRefreshing = false;

// ================= TOKEN =================
export async function getShiprocketToken(forceRefresh = false) {
  // ✅ Use cached token
  if (!forceRefresh && shiprocketToken && tokenExpiry && Date.now() < tokenExpiry) {
    return shiprocketToken;
  }

  // ✅ Wait if already refreshing (IMPORTANT FIX)
  if (isRefreshing) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return shiprocketToken;
  }

  try {
    isRefreshing = true;

    console.log("🔐 Logging into Shiprocket...");

    const res = await fetch(
      `${process.env.SHIPROCKET_API_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: process.env.SHIPROCKET_EMAIL,
          password: process.env.SHIPROCKET_PASSWORD,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok || !data.token) {
      console.error("❌ Shiprocket Auth Failed:", data);
      throw new Error(data.message || "Shiprocket login failed");
    }

    shiprocketToken = data.token;

    // ✅ Safe expiry (8 days)
    tokenExpiry = Date.now() + 8 * 24 * 60 * 60 * 1000;

    console.log("✅ Token refreshed");

    return shiprocketToken;
  } finally {
    isRefreshing = false;
  }
}

// ================= GENERIC FETCH WITH RETRY =================
async function shiprocketFetch(url, options, retry = true) {
  let token = await getShiprocketToken();

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  let data = await res.json();

  // 🔁 AUTO RETRY IF TOKEN EXPIRED
  if (
    retry &&
    (res.status === 401 ||
      data?.message?.toLowerCase().includes("unauthenticated"))
  ) {
    console.log("🔁 Token expired, retrying...");

    token = await getShiprocketToken(true);

    res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    data = await res.json();
  }

  return { res, data };
}

// ================= CREATE SHIPMENT =================
export async function createShipment(payload) {
  try {
    console.log("📦 FINAL PAYLOAD:", payload);

    const { res, data } = await shiprocketFetch(
      `${process.env.SHIPROCKET_API_URL}/orders/create/adhoc`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    console.log("🚚 Shiprocket Response:", data);

    if (!res.ok || data?.status_code >= 400) {
      console.error("❌ Final Shiprocket Error:", data);
      throw new Error(data?.message || "Shipment failed");
    }

    return data;
  } catch (err) {
    console.error("❌ Shipment Creation Failed:", err.message);
    return null; // NEVER BREAK ORDER FLOW
  }
}

// ================= SHIPPING RATES =================
export async function getShippingRates(pincode) {
  try {
    const pickupPincode = process.env.PICKUP_PINCODE;

    const { res, data } = await shiprocketFetch(
      `${process.env.SHIPROCKET_API_URL}/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${pincode}&cod=1&weight=0.5`,
      {
        method: "GET",
      }
    );

    if (!res.ok || !data?.data?.available_courier_companies) {
      throw new Error("No courier available");
    }

    const couriers = data.data.available_courier_companies;

    const cheapest = couriers.sort((a, b) => a.rate - b.rate)[0];

    return {
      success: true,
      price: cheapest.rate,
      courier: cheapest.courier_name,
      etd: cheapest.etd,
    };
  } catch (err) {
    console.error("❌ Shipping Rate Error:", err.message);
    return { success: false, price: 0 };
  }
}

// ================= ASSIGN COURIER =================
export async function assignCourier(shipment_id) {
  try {
    const { res, data } = await shiprocketFetch(
      `${process.env.SHIPROCKET_API_URL}/courier/assign/awb`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipment_id }),
      }
    );

    console.log("🚚 Courier Assign Response:", data);

    // ❌ Sometimes Shiprocket delays AWB → don't break flow
    if (!res.ok || data?.status_code >= 400) {
      console.warn("⚠️ Courier not assigned immediately");
      return null;
    }

    return data;
  } catch (err) {
    console.error("❌ Courier Assign Error:", err.message);
    return null;
  }
}