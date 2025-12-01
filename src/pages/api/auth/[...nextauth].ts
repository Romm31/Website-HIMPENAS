import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import type { IncomingMessage } from "http";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_HOURS = 2;

function getIpFromReq(req: IncomingMessage): string {
  const forwarded = (req.headers["x-forwarded-for"] || "") as string;
  if (forwarded) return forwarded.split(",")[0].trim();
  // @ts-ignore
  return (req.socket && (req.socket as any).remoteAddress) || "unknown";
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  pages: {},
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password wajib diisi.");
        }

        // @ts-ignore
        const ip = getIpFromReq(req as IncomingMessage);
        const now = new Date();

        let record = await prisma.loginAttempt.findUnique({
          where: { ip },
        });

        if (record && record.lockedUntil && record.lockedUntil > now) {
          const minutesLeft = Math.ceil(
            (record.lockedUntil.getTime() - now.getTime()) / (1000 * 60)
          );
          throw new Error(
            `Terlalu banyak percobaan login. Coba lagi dalam ${minutesLeft} menit.`
          );
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          const attempts = (record?.attempts || 0) + 1;
          let lockoutUntil: Date | null = null;

          if (attempts >= MAX_LOGIN_ATTEMPTS) {
            lockoutUntil = new Date(
              now.getTime() + LOCKOUT_DURATION_HOURS * 60 * 60 * 1000
            );
          }

          await prisma.loginAttempt.upsert({
            where: { ip },
            update: {
              attempts,
              lockedUntil: lockoutUntil,
              lastAttempt: now,
            },
            create: {
              ip,
              attempts,
              lockedUntil: lockoutUntil,
              lastAttempt: now,
            },
          });

          throw new Error("Email atau password salah.");
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          const attempts = (record?.attempts || 0) + 1;
          let lockoutUntil: Date | null = null;

          if (attempts >= MAX_LOGIN_ATTEMPTS) {
            lockoutUntil = new Date(
              now.getTime() + LOCKOUT_DURATION_HOURS * 60 * 60 * 1000
            );
          }

          await prisma.loginAttempt.upsert({
            where: { ip },
            update: {
              attempts,
              lockedUntil: lockoutUntil,
              lastAttempt: now,
            },
            create: {
              ip,
              attempts,
              lockedUntil: lockoutUntil,
              lastAttempt: now,
            },
          });

          throw new Error("Email atau password salah.");
        }

        await prisma.loginAttempt.deleteMany({ where: { ip } });

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },

    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
};

export default NextAuth(authOptions);
