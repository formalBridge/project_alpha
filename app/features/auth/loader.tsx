import { redirect } from '@remix-run/node';
import { serialize } from 'cookie';

import { authenticator } from 'app/external/auth/auth.server';
import { createJwt } from 'app/external/auth/jwt.server';
import createLoader from 'app/utils/createLoader';

export const authCallbackLoader = createLoader(async ({ request }) => {
  const user = await authenticator.authenticate('google', request);

  if (!user) {
    return redirect('/login/error', { status: 401 });
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

  const redirectTarget = user.handle.startsWith('google-')
    ? `/profile/${user.id}/editHandle`
    : `/profile/${user.id}/show`;

  return redirect(redirectTarget, {
    headers: {
      'Set-Cookie': jwtCookie,
    },
  });
});

export const logoutLoader = createLoader(async () => {
  const expiredJwtCookie = serialize('jwt', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return redirect('/', {
    headers: { 'Set-Cookie': expiredJwtCookie },
  });
});
