import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // allow public routes
  if (pathname.startsWith("/admin/login")) return NextResponse.next();
  if (pathname.startsWith("/api/auth/login")) return NextResponse.next();

  // protect /admin/*
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      return NextResponse.next();
    } catch (err) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
