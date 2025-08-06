import { serialize } from 'cookie';

import { authenticator } from 'app/external/auth/auth.server';
import { createJwt } from 'app/external/auth/jwt.server';
import createLoader from 'app/utils/createLoader';

export const authCallbackLoader = createLoader(async ({ request }) => {
  const user = await authenticator.authenticate('google', request);
  
  if(!user) {
    return new Response(null, { status: 302, headers: { Location: '/login'}});
  }

  const jwt = await createJwt({
    id: user.id,
    name: user.name
  });

  const jwtCookie = serialize('jwt', jwt, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, //7d
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: `/profile/${user.id}/show`,
      'Set-Cookie': jwtCookie,
    },
  });
});

export const googleAuthLoader = createLoader(async ({ request }) => {
  return authenticator.authenticate('google', request);
});
