import { PrismaClient, User, Song } from '@prisma/client';

import createService from 'app/utils/createService';

type UserWithRecommendedSong = User & { todayRecommendedSong: Song | null };

export const fetchUserIncludeRecomandSong =
  (db: PrismaClient) =>
  async (userId: number): Promise<UserWithRecommendedSong | null> => {
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    let recommendedSong: Song | null = null;
    if (user.todayRecommendedSongId) {
      recommendedSong = await db.song.findUnique({
        where: { id: user.todayRecommendedSongId },
      });
    }

    return { ...user, todayRecommendedSong: recommendedSong };
  };

export const fetchUser = createService<{ id: number }, User | null>(async (db, { id }) => {
  return await db.user.findFirst({ where: { id: id } });
});
