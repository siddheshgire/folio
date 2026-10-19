import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, SessionData } from "@/lib/auth/session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME);

  let session: SessionData | null = null;
  if (sessionCookie?.value) {
    try {
      const decoded = decodeURIComponent(sessionCookie.value);
      session = JSON.parse(decoded);

      // Verify expiration
      if (session && Date.now() > session.expiresAt) {
        session = null;
      }
    } catch (e) {
      session = null;
    }
  }

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isMfaPage = pathname === "/mfa";
  const isProtectedPage = pathname.startsWith("/dashboard") || pathname.startsWith("/group");

  // 1. If trying to access protected pages without a valid session -> Redirect to Login
  if (isProtectedPage && (!session || !session.mfaVerified)) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    if (session && Date.now() > session.expiresAt) {
      loginUrl.searchParams.set("expired", "true");
    }

    const response = NextResponse.redirect(loginUrl);
    // If expired cookie exists, clear it
    if (sessionCookie && !session) {
      response.cookies.delete(SESSION_COOKIE_NAME);
    }
    return response;
  }

  // 2. If already logged in with valid MFA and visits /login or /register -> Redirect to Dashboard
  if (isAuthPage && session && session.mfaVerified) {
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 3. If already logged in and visits /mfa -> Redirect to Dashboard
  if (isMfaPage && session && session.mfaVerified) {
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/group/:path*",
    "/login",
    "/register",
    "/mfa",
  ],
};
