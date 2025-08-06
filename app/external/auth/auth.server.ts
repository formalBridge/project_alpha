import { PrismaClient, User } from '@prisma/client';
import { Authenticator } from 'remix-auth';
import { GoogleStrategy, GoogleProfile } from 'remix-auth-google';

import { findOrCreateUser } from 'app/features/auth/services';

import { sessionStorage } from './session.server';

export const authenticator = new Authenticator<User>(sessionStorage);

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI;

if (!googleClientId || !googleClientSecret || !googleRedirectUri) {
  throw new Error('Missing Google OAuth environment variables.');
}

const googleStrategy = new GoogleStrategy<User>(
  {
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: googleRedirectUri,
  },
  async ({ accessToken: _accessToken, profile }: { accessToken: string; profile: GoogleProfile }) => {
    const db = new PrismaClient();

    try {
      const handle = `google-${profile.id.substring(0, 8)}`;
      const user = await findOrCreateUser(db)({
        email: profile.emails[0].value,
        googleId: profile.id,
        name: profile.displayName,
        handle,
      });
      return user;
    } finally {
      await db.$disconnect();
    }
  }
);

authenticator.use(googleStrategy, 'google');
