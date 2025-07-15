import { User, Prisma } from '@prisma/client';

import createService from 'app/utils/createService';

export const fetchUser = createService<{ id: number }, User | null>(async (db, { id }) => {
  return await db.user.findFirst({ where: { id: id } });
});

export type UserWithRecommendedSong = Prisma.UserGetPayload<{
  include: { todayRecommendedSong: true };
}>;

export type UserRankingWithSong = Prisma.UserRankingGetPayload<{
  include: { song: true };
}>;

export const fetchUserWithRecomandSong = createService<{ userId: number }, UserWithRecommendedSong | null>(
  async (db, { userId }) => {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        todayRecommendedSong: true,
      },
    });

    if (!user) {
      return null;
    }

    return user as UserWithRecommendedSong;
  }
);

export const fetchUserWithUserRankings = createService<{ userId: number }, UserRankingWithSong[]>(
  async (db, { userId }) => {
    const userRankings = await db.userRanking.findMany({
      where: { id: userId },
      include: {
        song: true,
      },
      orderBy: {
        rank: 'asc',
      },
    });
    return userRankings as UserRankingWithSong[];
  }
);

export const findUserByHandle = createService<{ handle: string }, User | null>(async (db, args) => {
  const user = await db.user.findUnique({
    where: {
      handle: args.handle,
    },
  });
  return user;
});
