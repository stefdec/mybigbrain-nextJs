// middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/login") {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/dashboardxx/:path*"], // Protects only the `/dashboard` folder and any sub-paths
};
