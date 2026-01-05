import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Simple backend auth error class
class BackendAuthError extends CredentialsSignin {
  code: string;
  constructor(message: string) {
    super(message);
    this.code = message;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new BackendAuthError("Provide email and password");
        }

        const response = await fetch(
          `${process.env.LOCAL_BACKENDBASE_URL}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials.email,
              password: credentials.password,
            }),
          }
        );

        const user = (await response.json()) as {
          user?: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            password?: string;
            status: "active" | "inactive" | "suspended";
            companyId?: string;
          };
          message: string;
        };

        if (!response.ok) {
          throw new BackendAuthError(user.message || "Invalid credentials.");
        }

        // Return user object (NextAuth will include this on `user` in callbacks)
        if (user.user) {
          return {
            id: user.user.id,
            name: `${user.user.firstName} ${user.user.lastName}`,
            email: user.user.email,
            status: user.user.status,
            companyId: user.user.companyId,
          };
        } else return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // Store user data in JWT token
    jwt: async ({ token, user }) => {
      if (user) {
        token.companyId = user.companyId;
        token.status = user.status;
      }
      return token;
    },
    // Add user data to session from token
    session: async ({ session, token }) => {
      if (session.user) {
        (session.user as any).companyId = token.companyId;
        (session.user as any).status = token.status;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.AUTH_SECRET,
});
