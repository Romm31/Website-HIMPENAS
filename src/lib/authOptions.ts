import type { AuthOptions } from "next-auth";

/**
 * Minimal NextAuth configuration so getServerSession() can run
 * without adding or changing any login logic in your app.
 */
export const authOptions: AuthOptions = {
  providers: [], // no providers needed because you're not using NextAuth for login
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
