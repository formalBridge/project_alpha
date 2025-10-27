import { data } from '@remix-run/node';

import createLoader from 'app/utils/createLoader';

import { findUserByHandleSim, getRecommendedUsers } from './services';

export const searchLoader = createLoader(async ({ db, request }) => {
  const url = new URL(request.url);
  const handle = url.searchParams.get('handle');
  const recommendedUsersPromise = getRecommendedUsers(db)();
  const searchResultsPromise = handle ? findUserByHandleSim(db)({ handle }) : Promise.resolve(null);
  const [recommendedUsers, searchResults] = await Promise.all([recommendedUsersPromise, searchResultsPromise]);
  return data({
    recommendedUsers,
    searchResults,
    query: handle,
  });
});
