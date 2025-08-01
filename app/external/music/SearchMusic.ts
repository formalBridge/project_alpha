import { SearchParams, MusicInfo } from 'app/external/music/IMusicSearchAPI';

import { MusicBrainzAPI } from './musicBrainz';

export class SearchMusic {
  constructor(private musicAPI: MusicBrainzAPI) {}

  public async searchSong(params: SearchParams): Promise<MusicInfo[]> {
    return this.musicAPI.search(params);
  }

  public async searchSongWithQuery(query: string): Promise<MusicInfo[]> {
    return this.musicAPI.searchSongWithQuery(query);
  }
}

export const searchMusic = new SearchMusic(new MusicBrainzAPI());
