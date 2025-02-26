import createLoader from 'app/utils/createLoader';

import { fetchUser } from './services';

export const showLoader = createLoader(async ({ db, params }) => {
  const user = await fetchUser(db)({ id: Number(params.userId) });

  return { user };
});
