import { redirect } from '@remix-run/react';

import { authenticator } from 'app/external/auth/auth.server';
import { getCurrentDBUser, getCurrentUser, requireUserOwnership } from 'app/external/auth/jwt.server';
import { buildSpotifyTrackUrl, getSpotifyEmbed } from 'app/external/music/SpotifyOEmbed';
import createLoader from 'app/utils/createLoader';

import {
  fetchAccountSettingsData,
  fetchFollowers,
  fetchFollowing,
  fetchUserMusicMemo,
  fetchUserProfile,
  isUserFollowing,
} from './services';

export const profileLayoutLoader = createLoader(async ({ request, db }) => {
  const user = await getCurrentDBUser(request, db);

  return { user };
});

export const profileLoader = createLoader(async ({ db, params, request }) => {
  const profileUserId = Number(params.userId);
  const url = new URL(request.url);
  const sort = url.searchParams.get('sort') || 'desc';
  const sortOrder = sort === 'asc' ? 'asc' : 'desc';

  const profileUser = await fetchUserProfile(db)({ userId: profileUserId });
  const currentUser = await getCurrentDBUser(request, db);
  if (!profileUser || !currentUser) {
    throw new Response('User Not Found', { status: 404 });
  }

  const userMusicMemo = await fetchUserMusicMemo(db)({ userId: profileUserId, sortOrder: sortOrder });
  const isFollowing = await isUserFollowing(db)({ followerId: currentUser.id, followingId: profileUser.id });

  const spotifyEmbed = profileUser.todayRecommendedSong?.spotifyId
    ? await getSpotifyEmbed(buildSpotifyTrackUrl(profileUser.todayRecommendedSong.spotifyId)).catch((error) => {
        console.error('Failed to fetch Spotify embed:', error);
        return null;
      })
    : null;

  return { user: profileUser, userMusicMemo, isFollowing, spotifyEmbed };
});

export const profileRedirectLoader = createLoader(async ({ request }) => {
  const user = await getCurrentUser(request);

  if (!user) {
    return authenticator.authenticate('google', request);
  }

  return redirect(`/profile/${user.id}/feed`);
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
    avatarUrl: settingsData.avatarUrl,
  };
});

export const followsLoader = createLoader(async ({ db, request, params }) => {
  const profileUserId = Number(params.userId);
  if (isNaN(profileUserId)) {
    throw new Response('Invalid user ID', { status: 400 });
  }

  const url = new URL(request.url);
  const tab = url.searchParams.get('tab') === 'following' ? 'following' : 'followers';

  const currentUser = await getCurrentDBUser(request, db);
  if (!currentUser) {
    throw new Response('User Not Found', { status: 404 });
  }

  const list =
    tab === 'following'
      ? await fetchFollowing(db)({ userId: profileUserId })
      : await fetchFollowers(db)({ userId: profileUserId });

  const followingIds = new Set(
    (
      await db.follow.findMany({
        where: { followerId: currentUser.id },
        select: { followingId: true },
      })
    ).map((follow) => follow.followingId)
  );

  const listWithFollowingStatus = list.map((user) => ({
    ...user,
    isFollowing: followingIds.has(user.id),
  }));

  return { list: listWithFollowingStatus, tab, currentUserId: currentUser.id };
});
