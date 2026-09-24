import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "STUDENT" | "ADMIN";
      phone: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "STUDENT" | "ADMIN";
    phone: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends JWTType {
    id: string;
    role: "STUDENT" | "ADMIN";
    phone: string;
  }
}
