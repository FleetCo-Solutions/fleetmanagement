import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "./db"
import { users } from "./db/schema"
import { eq } from "drizzle-orm"
 
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
          let user = null

          
   
          // logic to salt and hash password
        //   const pwHash = saltAndHashPassword(credentials.password)
   
        //   // logic to verify if the user exists
        //   user = await getUserFromDb(credentials.email, pwHash)
        if(credentials.email && credentials.password ) {
          const user = await db.select({
            id: users.id,
            email: users.email,
            passwordHash: users.passwordHash
          }).from(users).where(eq(users.email, credentials.email as string));

          if (user.length > 0 && user[0].passwordHash === credentials.password) {
            return user[0];
          } else {
            throw new Error("Invalid credentials.");
          }
          
        }
          // return user object with their profile data
          return user
        },
      }),
  ],
})