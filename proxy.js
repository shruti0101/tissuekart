import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function proxy(req) {
  const token = req.cookies.get("adminToken")?.value;

  // protect all admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/admin/:path*"],
};