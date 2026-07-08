import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import { authConfig } from "@/auth.config";
import { env, adminEmails, hasGoogleAuth } from "@/lib/env";
import { generateUniqueReferralCode } from "@/lib/referral";

const providers: NextAuthConfig["providers"] = [];
if (hasGoogleAuth) {
  providers.push(
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
  );
}
// Dev/Admin fallback so the app runs without Google OAuth configured.
providers.push(
  Credentials({
    id: "dev",
    name: "Tài khoản Admin",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Mật khẩu", type: "password" },
    },
    async authorize(creds) {
      const email = creds?.email as string | undefined;
      const password = creds?.password as string | undefined;
      if (!email) return null;

      // In production, require the correct admin password to prevent unauthorized access
      if (env.NODE_ENV === "production" || process.env.VERCEL) {
        if (!password || password !== env.ADMIN_PASSWORD) {
          return null; // Reject login if password doesn't match
        }
      }

      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name: email.split("@")[0] || "Admin",
            status: "active",
            referralCode: await generateUniqueReferralCode(),
            isAdmin: adminEmails.includes(email.toLowerCase()) || true, // Force admin for this fallback
          },
        });
      }
      
      // Ensure the user is marked as admin if they use this login
      if (!user.isAdmin) {
         await prisma.user.update({
           where: { email },
           data: { isAdmin: true }
         });
      }

      return { id: user.id, email: user.email, name: user.name, image: user.image };
    },
  }),
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers,
  events: {
    async createUser({ user }) {
      if (!user.id || !user.email) return;
      const isAdmin = adminEmails.includes(user.email.toLowerCase());
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isAdmin,
          status: "active",
          referralCode: await generateUniqueReferralCode(),
        },
      });
    },
  },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        token.email = user.email ?? token.email;
      }
      // Refresh role/status at most every 60s.
      const now = Math.floor(Date.now() / 1000);
      if (!token.lastRefresh || now - (token.lastRefresh as number) > 60) {
        const dbUser = await prisma.user.findUnique({
          where: { id: (token.id as string) ?? undefined },
          select: { isAdmin: true, status: true, name: true, image: true, referralCode: true },
        });
        if (dbUser) {
          token.isAdmin = dbUser.isAdmin;
          token.status = dbUser.status;
          token.name = dbUser.name;
          token.picture = dbUser.image;
          token.referralCode = dbUser.referralCode;
        }
        token.lastRefresh = now;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.isAdmin = (token.isAdmin as boolean) ?? false;
        session.user.status = (token.status as string) ?? "active";
        session.user.referralCode = (token.referralCode as string | undefined) ?? undefined;
      }
      return session;
    },
  },
});
