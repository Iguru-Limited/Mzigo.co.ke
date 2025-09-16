import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Check if device_id cookie exists
  const deviceId = request.cookies.get("device_id");

  if (!deviceId) {
    // Generate new UUID v4
    const newId = uuidv4();

    // Set the cookie
    response.cookies.set("device_id", newId, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year in seconds
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
