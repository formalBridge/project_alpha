import { redirect } from '@remix-run/react';

import { authenticator } from 'app/external/auth/auth.server';
import { getUserFromSession } from 'app/external/auth/session.server';
import createLoader from 'app/utils/createLoader';

import { fetchUserWithRecomandSong, fetchUserWithUserRankings, findUserByHandleSim } from './services';

export const profileLoader = createLoader(async ({ db, params }) => {
  const userId = Number(params.userId);
  const user = await fetchUserWithRecomandSong(db)({ userId: userId });

  if (!user) {
    throw new Response('User Not Found', { status: 404 });
  }

  const userRankings = await fetchUserWithUserRankings(db)({ userId: userId });

  return { user, userRankings };
});

export const profileRedirectLoader = createLoader(async ({ request }) => {
  const user = await getUserFromSession(request);

  if (!user) {
    return authenticator.authenticate('google', request);
  }

  return redirect(`/profile/${user.id}/show`);
});

export const searchLoader = createLoader(async ({ db, request }) => {
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);
  const handle = search.get('handle');

  if (!handle) {
    return { users: [] };
  }
  const users = await findUserByHandleSim(db)({ handle });

  return { users };
});
