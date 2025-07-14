import createLoader from 'app/utils/createLoader';

import { fetchUserIncludeRecomandSong, fetchUserRankings } from './services';

export const profileLoader = createLoader(async ({ db, params }) => {
  const userId = Number(params.userId);
  const user = await fetchUserIncludeRecomandSong(db)({ userId: userId });

  if (!user) {
    throw new Response('User Not Found', { status: 404 });
  }

  const userRankings = await fetchUserRankings(db)({ userId: userId });

  return { user, userRankings };
});
