// import NextAuth, { DefaultSession } from "next-auth";
// import "next-auth/jwt";

// declare module "next-auth" {
//   interface Session {
//     userToken?: string;
//     expiresAt?: number;
//     user?: {
//       name: string;
//       email: string;
//       roles: string[];
//       phone: string;
//       status: string;
//       department: {
//         id: number;
//         name: string;
//       };
//     };
//   }

//   interface User {
//     name: string;
//     email: string;
//     roles: string[];
//     phone: string;
//     status: string;
//     department: {
//       id: number;
//       name: string;
//     };
//     token: string;
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     userToken?: string;
//     expiresAt?: number;
//     userInfo?: {
//       name: string;
//       email: string;
//       roles: string[];
//       phone: string;
//       status: string;
//       department: {
//         id: number;
//         name: string;
//       };
//     } & AdapterUser;
//   }
// }
