import createLoader from 'app/utils/createLoader';

import { fetchUser } from './services';
import { fetchUserIncludeRecomandSong } from './services';

export const profileLoader = createLoader(async ({ db, params }) => {
  const userId = Number(params.userId);
  const user = await fetchUserIncludeRecomandSong(db)(userId);

  if (!user) {
    throw new Response('User Not Found', { status: 404 });
  }

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

  return { user, userRankings };
});
