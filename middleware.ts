import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Role } from "@prisma/client";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Set pathname header for Server Components to access
    const response = NextResponse.next();
    response.headers.set("x-pathname", path);

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

    // Protect /admin/approvals route - require OWNER
    if (path.startsWith("/admin/approvals")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }

      const userRole = token.role as Role;
      if (userRole !== "OWNER") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Protect all /admin routes - require authentication
        if (path.startsWith("/admin")) {
          return !!token;
        }

        // Protect /clients routes - require authentication
        if (path.startsWith("/clients")) {
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
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
