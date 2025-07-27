import { LoaderFunctionArgs } from '@remix-run/node';

import { authenticator } from 'app/external/auth/auth.server';
import { commitSession, getSession, getUserFromSession } from 'app/external/auth/session.server';
import createLoader from 'app/utils/createLoader';

export const loginLoader = createLoader(async ({ request }: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  });

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error('Missing Google OAuth environment variables.');
  }

  return { clientId, redirectUri };
});

export const authCallbackLoader = createLoader(async ({ request }) => {
  const user = await authenticator.authenticate('google', request).catch((error) => {
    console.error('❌ Auth failed', error);
    throw error;
  });

  if (!user) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/login' },
    });
  }

  const session = await getSession(request.headers.get('Cookie'));

  session.set('user', {
    accessToken: user.accessToken,
    name: user.name,
    email: user.email,
    handle: user.handle,
  });

  const cookie = await commitSession(session);

  return new Response(null, {
    status: 302,
    headers: {
      Location: '/',
      'Set-Cookie': cookie,
    },
  });
});

export const googleAuthLoader = createLoader(async ({ request }) => {
  return authenticator.authenticate('google', request);
});

export const accessTokenLoader = createLoader(async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  const accessToken = session.get('accessToken');

  if (!accessToken) {
    throw new Response('Unauthorized', { status: 401 });
  }
  return { accessToken };
});

export const currentUserLoader = createLoader(async ({ request }) => {
  const user = await getUserFromSession(request);
  return { user };
});
