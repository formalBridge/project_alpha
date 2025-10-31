import createLoader from 'app/utils/createLoader';

import { searchSongInputLoader } from './components/SearchSongInputloader';
import { findUserByHandleSim } from './services';

export const searchLoader = createLoader(async ({ request, db }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('search') ?? '';
  const type = url.searchParams.get('tab') ?? 'music';

  const results = await (async () => {
    if (type === 'music') {
      return await searchSongInputLoader({ searchQuery: query });
    }
    if (query) {
      return await findUserByHandleSim(db)({ handle: query });
    }
    return null;
  })();

  return { query, results };
});
