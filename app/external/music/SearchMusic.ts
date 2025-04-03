import { SearchParams, MusicInfo } from 'app/external/music/IMusicSearchAPI';

import { MusicBrainzAPI } from './musicBrainz';

export class SearchMusic {
  constructor(private musicAPI: MusicBrainzAPI) {}

  async searchSong(params: SearchParams): Promise<MusicInfo[]> {
    return this.musicAPI.search(params);
  }
}

export const searchMusic = new SearchMusic(new MusicBrainzAPI());
