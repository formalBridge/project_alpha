import { User, Prisma } from '@prisma/client';

import createService from 'app/utils/createService';

export const fetchUser = createService<{ id: number }, User | null>(async (db, { id }) => {
  return await db.user.findFirst({ where: { id: id } });
});

export type UserWithRecommendedSong = Prisma.UserGetPayload<{
  include: { todayRecommendedSong: true };
}>;

export type UserForProfile = Prisma.UserGetPayload<{
  include: {
    todayRecommendedSong: true;
    _count: {
      select: {
        followers: true;
        following: true;
      };
    };
  };
}>;

export const fetchUserProfile = createService<{ userId: number }, UserForProfile | null>(async (db, { userId }) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      todayRecommendedSong: true,
      _count: {
        select: { followers: true, following: true },
      },
    },
  });

  if (!user) {
    return null;
  }

  return user as UserForProfile;
});

export const isUserFollowing = createService<{ followerId: number; followingId: number }, boolean>(
  async (db, { followerId, followingId }) => {
    const follow = await db.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
    return !!follow;
  }
);

export const fetchUserMusicMemo = createService<
  { userId: number; sortOrder?: 'asc' | 'desc' },
  Prisma.UserMusicMemoGetPayload<{ include: { song: true } }>[]
>(async (db, { userId, sortOrder = 'desc' }) => {
  const musicMemos = await db.userMusicMemo.findMany({
    where: { userId },
    include: {
      song: true,
    },
    orderBy: {
      updatedAt: sortOrder,
    },
  });
  return musicMemos;
});

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
      where: {
        id: {
          gte: 20,
          lte: 25,
        },
      },
      include: { todayRecommendedSong: true },
    });
    // TODO: avatarUrl 추가 필요
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

//TODO: avartarUrl 필드 생성 후 주석 제거
export interface AccountSettingData {
  handle: string | null;
  // avartalUrl: string | null;
}

export const fetchAccountSettingsData = createService<{ id: number }, AccountSettingData | null>(async (db, { id }) => {
  const user = await db.user.findUnique({
    where: { id },
    select: {
      handle: true,
      // avartarUrl: true,
    },
  });

  return user;
});

export const validateUserExist = createService<{ followerId: number; followingId: number }, boolean>(
  async (db, { followerId, followingId }) => {
    const userIds = [followerId, followingId];
    const users = await db.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: { id: true },
    });
    return users.length === userIds.length;
  }
);

export const followUser = createService<{ followerId: number; followingId: number }, number>(
  async (db, { followerId, followingId }) => {
    if (followerId === followingId) {
      throw new Error('자기 자신은 팔로우할 수 없습니다.');
    }

    const usersAreValid = await validateUserExist(db)({ followerId, followingId });
    if (!usersAreValid) {
      throw new Error('존재하지 않는 사용자입니다.');
    }

    await db.follow.create({
      data: {
        followerId,
        followingId,
      },
    });
    return followerId;
  }
);

export const unfollowUser = createService<{ followerId: number; followingId: number }, number>(
  async (db, { followerId, followingId }) => {
    const usersAreValid = await validateUserExist(db)({ followerId, followingId });
    if (!usersAreValid) {
      throw new Error('존재하지 않는 사용자입니다.');
    }

    await db.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
    return followerId;
  }
);
