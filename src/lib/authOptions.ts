// src/lib/authOptions.ts
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { users } from "@/lib/db";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers:  [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await users.findOne({ email: credentials.email });
        if (user && user.password && await bcrypt.compare(credentials.password, user.password)) {
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };
        }
        return null;
      },
    })],
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {async signIn({ user, account }: { 
    user: { id?: string; name?: string | null; email?: string | null };
    account: { provider?: string } | null;
  }) {
    if (account?.provider === "google") {
      const existingUser = await users.findOne({ email: user.email || undefined });
      if (!existingUser) {
        await users.insert({
          name: user.name || '',
          email: user.email || '',
          password: null,
        });
      }
    }
    return true;
  },
},
secret: process.env.NEXTAUTH_SECRET,
  };