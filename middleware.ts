import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  // Protect /admin and /api/admin routes
  if (request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/api/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    try {
      await decrypt(session);
    } catch (e) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
