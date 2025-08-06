import { data, redirect } from '@remix-run/node';
import { serialize } from 'cookie';

import { authenticator } from 'app/external/auth/auth.server';
import { createJwt } from 'app/external/auth/jwt.server';
import createLoader from 'app/utils/createLoader';

export const authCallbackLoader = createLoader(async ({ request }) => {
  const user = await authenticator.authenticate('google', request);

  if (!user) {
    return data({ error: 'auth_failed' }, { status: 401, headers: { Location: '/login?error=auth_failed' } });
  }

  const jwt = await createJwt({
    id: user.id,
    name: user.name,
  });

  const jwtCookie = serialize('jwt', jwt, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, //7d
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return redirect(`/profile/${user.id}/show`, {
    headers: {
      'Set-Cookie': jwtCookie,
    },
  });
});

export const googleAuthLoader = createLoader(async ({ request }) => {
  return authenticator.authenticate('google', request);
});
