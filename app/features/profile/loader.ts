import { redirect } from '@remix-run/react';

import { authenticator } from 'app/external/auth/auth.server';
import { getUserFromSession } from 'app/external/auth/session.server';
import createLoader from 'app/utils/createLoader';

import { searchSongInputLoader } from './components/SearchSongInput';
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

export const addTodaySongLoader = createLoader(async ({ db, params, request }) => {
  // TODO: 본인 계정만 수정할 수 있도록 변경해야 함
  const userId = Number(params.userId);
  if (isNaN(userId)) {
    throw new Response('잘못된 사용자입니다.', { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      todayRecommendedSong: {
        select: {
          id: true,
          title: true,
          artist: true,
          album: true,
          thumbnailUrl: true,
        },
      },
    },
  });

  if (!user) {
    throw new Response('유저가 존재하지 않습니다.', { status: 404 });
  }

  const songs = searchSongInputLoader({ request });

  return { initialSong: user.todayRecommendedSong, songs };
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
