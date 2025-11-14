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
          };
        } else return null;
      },
    }),
  ],

  // session: {
  //   strategy: "jwt",
  // },

  // callbacks: {
  //   // Keep user object on the token for session callback
  //   jwt: async ({ token, user }) => {
  //     if (user) {
  //       // Attach the user object returned from `authorize` onto the token
  //       (token as any).user = user;
  //     }
  //     return token;
  //   },
  //   session: async ({ session, token }) => {
  //     // Expose the user object on the session for client usage
  //     if ((token as any).user) {
  //       (session as any).user = (token as any).user;
  //     }
  //     return session;
  //   },
  // },

  pages: {
    signIn: "/login",
  },

  secret: process.env.AUTH_SECRET,
});
