import { searchMusic } from 'app/external/music/SearchMusic';

export const searchSongInputLoader = ({ request }: { request: Request }) => {
  const searchQuery = new URL(request.url).searchParams.get('query');
  if (!searchQuery) {
    return undefined;
  }

  return searchMusic.searchSongWithQuery(searchQuery);
};
