import NextAuth from "next-auth";
import authConfig from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/courses/:path*",
    "/lessons/:path*",
    "/assignments/:path*",
    "/exams/:path*",
    "/results/:path*",
    "/notifications/:path*",
    "/subscriptions/:path*",
    "/profile/:path*",
    "/support/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
};