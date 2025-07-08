import { PrismaClient, User, Prisma } from '@prisma/client';

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

export const fetchUserIncludeRecomandSong =
  (db: PrismaClient) =>
  async (userId: number): Promise<UserWithRecommendedSong | null> => {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        todayRecommendedSong: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  };

export const fetchUserRankings =
  (db: PrismaClient) =>
  async (userId: number): Promise<UserRankingWithSong[]> => {
    const userRankings = await db.userRanking.findMany({
      where: {
        userId: userId,
      },
      include: {
        song: true,
      },
      orderBy: {
        rank: 'asc',
      },
    });
    return userRankings;
  };
