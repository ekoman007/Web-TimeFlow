import { NextResponse } from "next/server";

export function middleware(request: Request) {
  // Lexo të gjitha cookie-t
  const cookies = request.headers.get("cookie") || "";
debugger
  // Kontrollo nëse ekziston refreshToken ose accessToken
  const hasRefreshToken = cookies.includes("refreshToken=");
  // ose nëse po përdor vetëm accessToken në localStorage, kjo do mbetet gjithmonë false

  if (!hasRefreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
