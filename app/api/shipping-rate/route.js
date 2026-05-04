import { getShippingRates } from "@/lib/shiprocket";

export async function GET(req) {
  try { 
    const { searchParams } = new URL(req.url);
    const pincode = searchParams.get("pincode");

    if (!pincode) {
      return Response.json({ success: false }, { status: 400 });
    }

    const rate = await getShippingRates(pincode);

    return Response.json(rate);
  } catch (err) {
    return Response.json({ success: false });
  }
}