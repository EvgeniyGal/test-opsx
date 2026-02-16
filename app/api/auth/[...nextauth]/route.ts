import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // TODO: Implement actual authentication logic
        // This is a minimal implementation for development
        if (credentials?.email && credentials?.password) {
          return {
            id: "1",
            email: credentials.email,
          };
        }
        return null;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
