import { Prisma } from '@prisma/client';

import createService from 'app/utils/createService';

export type FeedListItem = Prisma.FeedDataGetPayload<{
  include: {
    memo: {
      include: {
        user: true;
        song: true;
      };
    };
  };
}>;

export const fetchFeedList = createService<{ userId: number }, FeedListItem[]>(async (db, { userId }) => {
  const feedList = await db.feedData.findMany({
    where: { userId },
    include: {
      memo: {
        include: {
          user: true,
          song: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return feedList;
});
