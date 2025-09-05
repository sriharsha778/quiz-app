// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECREAT!);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;

  // Define public pages
  const publicPaths = ["/appLogin"];
  const isPublicPath = publicPaths.includes(path);

  // 1️⃣ Logged-in users cannot access public pages (like login)
  if (isPublicPath && token) {
    try {
      await jwtVerify(token, JWT_SECRET); // verify token
      return NextResponse.redirect(new URL("/Home", request.url));
    } catch {
      // invalid token → allow user to login
      return NextResponse.next();
    }
  }

  // 2️⃣ Protected pages
  const protectedPaths = ["/Home", "/createQuiz", "/quizLogin" , "/"];
  const isProtected = protectedPaths.includes(path);

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/appLogin", request.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/appLogin", request.url));
    }
  }

  // 3️⃣ Everything else → allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/createQuiz", "/quizLogin", "/Home", "/appLogin"], // include all routes you want middleware on
};
