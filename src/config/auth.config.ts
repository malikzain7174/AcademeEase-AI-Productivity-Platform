import type { NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/config/db.config';
import { verifyPassword } from '@/helpers/password';

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        verified: { label: 'Verified', type: 'text' }, // Special flag for just-verified users
      },
      async authorize(credentials) {
        // Special case for just-verified users
        if (credentials?.verified === 'true') {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });
          return user;
        }

        // Regular email/password login
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValidPassword = await verifyPassword(
          credentials.password as string,
          user.password
        );

        if (!isValidPassword) {
          return null;
        }

        // Instead of returning null for unverified users,
        // we'll return the user and handle verification in the callbacks
        return user;
      },
    }),
  ],
  pages: {
    signIn: '/signin',
    signOut: '/signout',
    error: '/signin',
    verifyRequest: '/verify-email',
    newUser: '/dashboard',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id || '';
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.isVerified = token.isVerified as boolean;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
};

export default authConfig;
