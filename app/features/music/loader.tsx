import { LoaderFunctionArgs, json } from '@remix-run/node';

import { MusicBrainzAPI } from 'app/external/music/musicBrainz';
import { SearchMusic } from 'app/external/music/SearchMusic';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const title = url.searchParams.get('title') ?? undefined;
  const artist = url.searchParams.get('artist') ?? undefined;
  const album = url.searchParams.get('album') ?? undefined;

  const searchMusic = new SearchMusic(new MusicBrainzAPI());
  const results = await searchMusic.searchSong({ title, artist, album });

  return json(results);
}
