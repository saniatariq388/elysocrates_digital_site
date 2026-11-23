import { NextResponse, type NextRequest } from "next/server";

import { isValidSessionToken, SESSION_COOKIE } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = await isValidSessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  if (pathname.startsWith("/dashboard") && !authenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && authenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
