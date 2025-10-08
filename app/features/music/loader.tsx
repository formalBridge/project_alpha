import { redirect } from '@remix-run/server-runtime';

import { getCurrentUser, requireUserOwnership } from 'app/external/auth/jwt.server';
import { buildSpotifyTrackUrl, getSpotifyEmbed } from 'app/external/music/SpotifyOEmbed';
import createLoader from 'app/utils/createLoader';

export const musicUserLoader = createLoader(async ({ db, params, request }) => {
  const songId = Number(params.songId);
  const userId = Number(params.userId);

  const currentUser = await getCurrentUser(request);
  const isCurrentUserProfile = currentUser?.id === userId;

  const song = await db.song.findUnique({ where: { id: songId } });
  const user = await db.user.findUnique({ where: { id: userId } });

  const UserMusicMemo = await db.userMusicMemo.findFirst({ where: { userId, songId } });

  const spotifyEmbed = song?.spotifyId ? await getSpotifyEmbed(buildSpotifyTrackUrl(song.spotifyId)) : null;
  const isMemoLiked = !!(await db.memoLikesUser.findFirst({
    where: { memoId: UserMusicMemo?.id, userId: currentUser?.id },
  }));

  return { song, user, UserMusicMemo, isCurrentUserProfile, spotifyEmbed, isMemoLiked };
});

export const musicCreateUserLoader = createLoader(async ({ db, params, request }) => {
  await requireUserOwnership(request, { userId: params.userId });

  const songId = Number(params.songId);
  const userId = Number(params.userId);

  const currentUser = await getCurrentUser(request);
  const isCurrentUserProfile = currentUser?.id === userId;

  const song = await db.song.findUnique({ where: { id: songId } });
  const user = await db.user.findUnique({ where: { id: userId } });

  const UserMusicMemo = await db.userMusicMemo.findFirst({ where: { userId, songId } });

  if (!!UserMusicMemo) {
    return redirect('..');
  }

  return { song, user, isCurrentUserProfile };
});
