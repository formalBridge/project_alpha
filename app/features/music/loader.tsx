import { LoaderFunctionArgs } from '@remix-run/node';

import { searchMusic } from 'app/external/music/SearchMusic';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const title = url.searchParams.get('title') ?? undefined;
  const artist = url.searchParams.get('artist') ?? undefined;
  const album = url.searchParams.get('album') ?? undefined;

  if (!title && !artist && !album) {
    return [];
  }

  const results = await searchMusic.searchSong({ title, artist, album });
  return results;
}
