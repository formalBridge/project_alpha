import { PrismaClient, User as PrismaUser } from '@prisma/client';
import { Authenticator } from 'remix-auth';
import { GoogleStrategy, GoogleProfile } from 'remix-auth-google';

import { findOrCreateUser } from 'app/features/auth/services';

import { sessionStorage } from './session.server';

type SessionUser = { accessToken: string } & PrismaUser;
export const authenticator = new Authenticator<SessionUser>(sessionStorage);

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI;

if (!googleClientId || !googleClientSecret || !googleRedirectUri) {
  throw new Error('Missing Google OAuth environment variables.');
}

const googleStrategy = new GoogleStrategy<SessionUser>(
  {
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: googleRedirectUri,
  },
  async ({ accessToken, profile }: { accessToken: string; profile: GoogleProfile }) => {
    console.log('🔑 accessToken', accessToken);
    console.log('👤 profile', profile);
    const db = new PrismaClient();

    try {
      const handle = `google-${profile.id.substring(0, 8)}`;
      const user = await findOrCreateUser(db)({
        email: profile.emails[0].value,
        googleId: profile.id,
        name: profile.displayName, // ⭐ name 필드 전달
        handle,
      });
      return {
        ...user,
        accessToken,
      };
    } finally {
      await db.$disconnect(); // PrismaClient 연결 해제
    }
  }
);

authenticator.use(googleStrategy, 'google');
