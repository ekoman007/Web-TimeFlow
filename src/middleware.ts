// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const cookies = request.headers.get("cookie") || "";
  const hasRefreshToken = cookies.includes("refreshToken="); // Verifikojmë për refreshToken në cookie
debugger
  // Kontrollojmë nëse ka accessToken në localStorage dhe refreshToken në cookies
  if (!hasRefreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Mund të shtoni një kontroll të plotë për tokenet e rinovuara
  // Përdorni një funksion të rinovuar në backend për të kontrolluar ose rinovuar accessToken me refreshToken.
  // Për shembull, mund të bëni kërkesën për refreshToken këtu

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // Apliko middleware vetëm për rrugët e mbrojtura
};
