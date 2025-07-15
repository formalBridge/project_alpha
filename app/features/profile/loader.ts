import createLoader from 'app/utils/createLoader';

import { fetchUserWithRecomandSong, fetchUserWithUserRankings } from './services';

export const profileLoader = createLoader(async ({ db, params }) => {
  const userId = Number(params.userId);
  const user = await fetchUserWithRecomandSong(db)({ userId: userId });

  if (!user) {
    throw new Response('User Not Found', { status: 404 });
  }

  const userRankings = await fetchUserWithUserRankings(db)({ userId: userId });

  return { user, userRankings };
});
