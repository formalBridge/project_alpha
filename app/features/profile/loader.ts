import { data } from '@remix-run/node';
import { redirect } from '@remix-run/react';

import { authenticator } from 'app/external/auth/auth.server';
import { getCurrentDBUser, getCurrentUser, requireUserOwnership } from 'app/external/auth/jwt.server';
import createLoader from 'app/utils/createLoader';

import { searchSongInputLoader } from './components/SearchSongInputloader';
import {
  fetchAccountSettingsData,
  fetchUserMusicMemo,
  fetchUserWithRecomandSong,
  findUserByHandleSim,
  getRecommendedUsers,
} from './services';

export const profileLayoutLoader = createLoader(async ({ request, db }) => {
  const user = await getCurrentDBUser(request, db);

  return { user };
});

export const profileLoader = createLoader(async ({ db, params }) => {
  const userId = Number(params.userId);
  const user = await fetchUserWithRecomandSong(db)({ userId: userId });

  if (!user) {
    throw new Response('User Not Found', { status: 404 });
  }

  const userMusicMemo = await fetchUserMusicMemo(db)({ userId: userId });

  return { user, userMusicMemo };
});

export const profileRedirectLoader = createLoader(async ({ request }) => {
  const user = await getCurrentUser(request);

  if (!user) {
    return authenticator.authenticate('google', request);
  }

  return redirect(`/profile/${user.id}/show`);
});

export const addTodaySongLoader = createLoader(async ({ db, params, request }) => {
  await requireUserOwnership(request, { userId: params.userId });

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
  const handle = url.searchParams.get('handle');
  const recommendedUsersPromise = getRecommendedUsers(db)();
  const searchResultsPromise = handle ? findUserByHandleSim(db)({ handle }) : Promise.resolve(null);
  const [recommendedUsers, searchResults] = await Promise.all([recommendedUsersPromise, searchResultsPromise]);
  return data({
    recommendedUsers,
    searchResults,
    query: handle,
  });
});

export const editHandleLoader = createLoader(async ({ request, params }) => {
  await requireUserOwnership(request, { userId: params.userId });

  const user = await getCurrentUser(request);
  if (!user) {
    throw redirect('/login/error', { status: 401 });
  }

  return { userId: user.id };
});

export const settingsLoader = createLoader(async ({ request, db, params }) => {
  await requireUserOwnership(request, { userId: params.userId });

  const user = await getCurrentUser(request);
  if (!user) {
    throw redirect('/login/error', { status: 401 });
  }

  const settingsData = await fetchAccountSettingsData(db)({ id: user.id });

  if (!settingsData) {
    throw redirect('/login/error', { status: 404 });
  }

  return {
    userId: user.id,
    handle: settingsData.handle,
    avatarUrl: '/images/features/profile/profile_test.png', //TODO: settingsData.avartarUrl으로 추수 수정
  };
});
