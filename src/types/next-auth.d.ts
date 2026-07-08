import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
      status: string;
      referralCode?: string;
    } & DefaultSession["user"];
  }
  interface User {
    isAdmin?: boolean;
    status?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    isAdmin?: boolean;
    status?: string;
    referralCode?: string;
    lastRefresh?: number;
  }
}
