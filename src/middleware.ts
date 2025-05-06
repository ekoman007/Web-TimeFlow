// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const cookies = request.headers.get("cookie") || "";
  const hasRefreshToken = cookies.includes("refreshToken="); // Verifikojmë për refreshToken në cookie

  // Kontrollojmë nëse ka refreshToken në cookies
  if (!hasRefreshToken) {
    return NextResponse.redirect(new URL("/page/login", request.url));
  }

  // Allow the request to continue if the refresh token is present
  return NextResponse.next();
}

export const config = {
  matcher: ["/page/dashboard/:path*"], // Apliko middleware vetëm për rrugët e mbrojtura
};
