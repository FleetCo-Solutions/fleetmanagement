import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      companyId?: string;
      status?: string;
      permissions: string[];
      role: string[];
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    companyId?: string;
    status?: string;
    permissions?: string[];
    role: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    companyId?: string;
    status?: string;
    permissions?: string[];
    role?: string[]
  }
}
