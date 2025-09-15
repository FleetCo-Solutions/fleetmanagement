import NextAuth from "next-auth";
import { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

class BackendAuthError extends CredentialsSignin {
  constructor(message: string) {
    super();
    this.code = message;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (credentials.email && credentials.password) {
          const response = await fetch(
            `${process.env.BACKENDBASE_URL}/v1/user/authenticate`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const user = await response.json();

          if (!response.ok || !user?.dto?.authResponseData?.token) {
            throw new BackendAuthError(user?.message || "Invalid credentials.");
          }

          return {
            name: user.dto.appUserData.name,
            email: user.dto.appUserData.email,
            status: user.dto.appUserData.status,
            phone: user.dto.appUserData.phone,
            roles: user.dto.appUserData.roles,
            department: user.dto.appUserData.departmentData,
            token: user.dto.authResponseData.token,
          };
        } else {
          throw new BackendAuthError("Provide email and password");
        }
      },
    }),
  ],

  //Session Strategy
  session: {
    strategy: "jwt",
  },

  //Callbacks adding jwt token to session
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        const payload = JSON.parse(Buffer.from(user.token.split('.')[1], 'base64').toString());
        token.userToken = user.token;
        token.expiresAt = payload.exp * 1000;
        token.userInfo = {
          name: user.name,
          email: user.email,
          status: user.status,
          phone: user.phone,
          roles: user.roles,
          department: user.department,
        }
      }

      // if (Date.now() > (token.expiresAt || 0)) {
      //   return {}; // This clears JWT → session invalid
      // }

      return token;
    },
    session: async ({ session, token }) => {
      if (token.userToken) {
        session.userToken = token.userToken;
        session.expiresAt = token.expiresAt;
        session.user = token.userInfo;
      }
      return session;
    },
  },

  // Default sign in page
  pages: {
    signIn: "/login",
  },

  //Secret for encrypting the JWT
  secret: process.env.AUTH_SECRET,
});
