import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      companyId?: string;
      status?: string;
    } & DefaultSession["user"];
  }

  interface User {
    companyId?: string;
    status?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    companyId?: string;
    status?: string;
  }
}
