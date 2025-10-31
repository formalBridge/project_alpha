import { data } from '@remix-run/node';

import createLoader from 'app/utils/createLoader';

import { searchSongInputLoader } from './components/SearchSongInputloader';

export const searchLoader = createLoader(async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('search') ?? '';

  const songs = searchSongInputLoader({ searchQuery: query });

  return data({
    query,
    songs,
  });
});
