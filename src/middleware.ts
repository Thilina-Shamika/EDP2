import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuth = !!token;

  // Check if the request is for a protected route
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.includes('/edit') ||
    request.nextUrl.pathname.includes('/delete');

  // If it's a protected route and user is not authenticated, redirect to login
  if (isProtectedRoute && !isAuth) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // For all other routes, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/blogs/:path*/edit",
    "/api/blogs/:path*/delete",
    "/api/properties/:path*/edit",
    "/api/properties/:path*/delete"
  ],
}; 