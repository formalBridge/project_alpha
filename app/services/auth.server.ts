import { PrismaClient, User as PrismaUser } from '@prisma/client';
import { createCookieSessionStorage } from '@remix-run/node';
import { Authenticator } from 'remix-auth';
import { GoogleStrategy, GoogleProfile } from 'remix-auth-google';

import { findOrCreateUser } from 'app/features/auth/services';

// import { sessionStorage } from './session.server';

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET is required');
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === 'production',
  },
});

export const authenticator = new Authenticator<PrismaUser>();

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI;

if (!googleClientId || !googleClientSecret || !googleRedirectUri) {
  throw new Error('Missing Google OAuth environment variables.');
}

const googleStrategy = new GoogleStrategy<PrismaUser>(
  {
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: googleRedirectUri,
  },
  async ({ profile }: { profile: GoogleProfile }) => {
    const db = new PrismaClient();

    try {
      const handle = `google-${profile.id.substring(0, 8)}`;

      const user = await findOrCreateUser(db)({
        email: profile.emails[0].value,
        googleId: profile.id,
        name: profile.displayName, // ⭐ name 필드 전달
        handle: handle,
      });
      return user; // Authenticator로 사용자 정보 반환
    } catch (error) {
      console.error('Error in GoogleStrategy verify callback:', error);
      throw new Error('Failed to process Google login.');
    } finally {
      await db.$disconnect(); // PrismaClient 연결 해제
    }
  }
);

authenticator.use(googleStrategy, 'google');
