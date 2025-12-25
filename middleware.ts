import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
 
  // Debug: Log all cookies
  console.log("All cookies:", request.cookies.getAll());
  
  const token = request.cookies.get("token")?.value;
  
  console.log("Token found:", !!token, "Path:", request.nextUrl.pathname);
  
  const { pathname } = request.nextUrl;

  // Block access to dashboard routes if no token cookie
  if (!token && pathname.startsWith("/dashboard")) {
    console.log("Redirecting to login - no token");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to dashboard if already logged in and visiting auth pages
  if (token && (pathname === "/login" || pathname === "/register")) {
    console.log("Redirecting to dashboard - already logged in");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
