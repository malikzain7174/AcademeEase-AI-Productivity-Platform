import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/config/db.config';
import { authConfig } from '@/config/auth.config';
import { verifyPassword } from '@/helpers/password';
import type { Adapter } from 'next-auth/adapters';
import { DAILY_CREDIT_LIMIT } from './constants';

// Define a type for our credentials
type CustomCredentials = {
  email?: string;
  password?: string;
  verified?: string;
};

// Remove duplicate callbacks from authConfig
const { callbacks, ...restAuthConfig } = authConfig;

// Create a custom Prisma adapter that adds 50 initial credits for new users
function CustomPrismaAdapter(p: typeof prisma): Adapter {
  return {
    ...PrismaAdapter(p),
    async createUser(user) {
      const created = await p.user.create({
        data: {
          ...user,
          credits: DAILY_CREDIT_LIMIT, // Give new users 50 initial credits
        },
      });

      return created;
    },
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: CustomPrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  ...restAuthConfig,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? ''; // Add null check to ensure user.id is a string
        token.name = user.name ?? null;
        token.email = user.email ?? null;
        token.isVerified = user.isVerified;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name || null;
        session.user.email = token.email as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.image = token.image as string | null;
      }
      return session;
    },
    async signIn({ user, account, profile, credentials }) {
      // Always allow OAuth providers (Google)
      if (account?.provider !== 'credentials') {
        return true;
      }

      // Only for credentials provider, we need additional validation
      const customCredentials = credentials as CustomCredentials;

      // Handle special case for just-verified users
      if (customCredentials?.verified === 'true') {
        return true;
      }

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: customCredentials?.email as string },
        select: {
          id: true,
          password: true,
          isVerified: true,
        },
      });

      if (!existingUser || !existingUser.password) {
        throw new Error('InvalidCredentials');
      }

      // Verify password
      const isValidPassword = await verifyPassword(
        customCredentials?.password as string,
        existingUser.password
      );

      if (!isValidPassword) {
        throw new Error('CredentialsSignin');
      }

      // We don't need to check isVerified here anymore since we're checking it in the signInWithEmail function

      return true;
    },
    async redirect({ url, baseUrl }) {
      // Default behavior
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
});

// Extend next-auth types
declare module 'next-auth' {
  interface User {
    isVerified: boolean;
    image?: string | null;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string;
    isVerified: boolean;
    name: string | null;
    email: string | null;
    image?: string | null;
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      isVerified: boolean;
      name: string | null;
      email: string | null;
      image?: string | null;
    };
  }
}
