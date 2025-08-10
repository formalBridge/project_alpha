import { getCurrentUser } from 'app/external/auth/jwt.server';
import createLoader from 'app/utils/createLoader';

export const musicUserLoader = createLoader(async ({ db, params, request }) => {
  const songId = Number(params.songId);
  const userId = Number(params.userId);

  const currentUser = await getCurrentUser(request);
  const isCurrentUserProfile = currentUser?.id === userId;

  const song = await db.song.findUnique({ where: { id: songId } });
  const user = await db.user.findUnique({ where: { id: userId } });

  const UserMusicMemo = await db.userMusicMemo.findFirst({ where: { userId, songId } });

  return { song, user, UserMusicMemo, isCurrentUserProfile };
});
