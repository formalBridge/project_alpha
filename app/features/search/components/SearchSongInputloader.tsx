import { searchMusic } from 'app/external/music/SearchMusic';

export const searchSongInputLoader = ({ searchQuery }: { searchQuery: string }) => {
  return searchMusic.searchSongWithQuery(searchQuery);
};
