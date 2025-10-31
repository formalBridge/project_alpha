import createLoader from 'app/utils/createLoader';

import { searchSongInputLoader } from './components/SearchSongInputloader';
import { findMemosByContent, findUserByHandleSim } from './services';

export const searchLoader = createLoader(async ({ request, db }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('search') ?? '';
  const tab = url.searchParams.get('tab') ?? 'music';

  const results = await (async () => {
    if (tab === 'music') {
      return await searchSongInputLoader({ searchQuery: query });
    } else if (tab === 'handle') {
      return await findUserByHandleSim(db)({ handle: query });
    } else if (tab === 'memo') {
      return await findMemosByContent(db)({ content: query });
    }

    return null;
  })();

  return { query, results };
});
