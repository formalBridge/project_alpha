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

export const findUserByHandleSim = createService<{ handle: string }, UserWithRecommendedSong[]>(async (db, args) => {
  const users = await db.user.findMany({
    where: {
      handle: {
        contains: args.handle,
        mode: 'insensitive',
      },
    },
    include: { todayRecommendedSong: true },
  });
  return users;
});

export const getRecommendedUsers = createService<Record<string, never>, UserWithRecommendedSong[]>(
  async (db, _args) => {
    const users = await db.user.findMany({
      take: 6,
      include: { todayRecommendedSong: true },
    });
    // TODO: avatarUrl 추가 필요(현재는 랜덤)
    return users.map((user) => ({
      ...user,
      avatarUrl: `https://i.pravatar.cc/150?u=${user.handle}`,
    }));
  }
);

export const updateUserHandle = createService<{ userId: string; handle: string }, User>(
  async (db, { userId, handle }) => {
    const existingUser = await db.user.findUnique({
      where: { handle },
    });

    if (existingUser && existingUser.id !== parseInt(userId)) {
      throw new Error('이미 사용 중인 handle입니다.');
    }
    return db.user.update({
      where: { id: parseInt(userId) },
      data: { handle },
    });
  }
);
