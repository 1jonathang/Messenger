// middleware checks validity of logged in user
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(async function middleware(req) {
  // current path that the user is on
  const pathname = req.nextUrl.pathname;

  // manage route protection
  const isAuthenticated = await getToken({ req });
  const isLoginPage = pathname.startsWith("/login");

  const sensitiveRoutes = ["/dashboard"];
  const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isLoginPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  }

  if (!isAuthenticated && isAccessingSensitiveRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
}, {
    callbacks: {
        async authorized() {
            // return true so that the middleware handling above is always called, if we didn't have this callback we'd have an infinite redirect and an error
            // in the browser telling us that this page is redirecting us too often. That's why we include this callback
            return true;
        }
    }
});

export const config = {
  // all paths that the middleware will operate on
  matcher: ["/", "/login", "/dashboard/:path*"],
};
