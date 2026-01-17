import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      companyId?: string;
      status?: string;
      permissions: string[];
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    companyId?: string;
    status?: string;
    permissions?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    companyId?: string;
    status?: string;
    permissions?: string[];
  }
}
