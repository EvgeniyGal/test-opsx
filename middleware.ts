import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Role } from "@prisma/client";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Protect /admin/users/** routes - require OWNER or MANAGER
    if (path.startsWith("/admin/users")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }

      const userRole = token.role as Role;
      if (userRole !== "OWNER" && userRole !== "MANAGER") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Protect all /admin routes - require authentication
        if (path.startsWith("/admin")) {
          return !!token;
        }

        // Allow public access to other routes
        return true;
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
  ],
};
