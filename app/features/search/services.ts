import { Prisma } from '@prisma/client';

import createService from 'app/utils/createService';

export type UserWithRecommendedSong = Prisma.UserGetPayload<{
  include: { todayRecommendedSong: true };
}>;

export type UserMusicMemoWithRelations = Prisma.UserMusicMemoGetPayload<{
  include: { user: true; song: true };
}>;

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
      where: {
        id: {
          gte: 20,
          lte: 25,
        },
      },
      include: { todayRecommendedSong: true },
    });
    return users.map((user) => ({
      ...user,
      avatarUrl: user.avatarUrl || '/images/features/profile/profile_default.png',
    }));
  }
);

export const findMemosByContent = createService<{ content: string }, UserMusicMemoWithRelations[]>(
  async (docToBlocks, args) => {
    const content = (args.content ?? '').trim();
    if (!content) return [];
    const memos = await docToBlocks.userMusicMemo.findMany({
      where: {
        content: {
          contains: content,
          mode: 'insensitive',
        },
      },
      include: {
        user: true,
        song: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return memos;
  }
);
