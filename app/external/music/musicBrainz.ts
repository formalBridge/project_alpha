import axios from 'axios';

import { MusicInfo, Recording, SearchParams } from './IMusicSearchAPI';

export class MusicBrainzAPI {
  private BASE_URL = 'https://musicbrainz.org/ws/2';

  private searchBase(query: string): Promise<MusicInfo[]> {
    return axios
      .get(`${this.BASE_URL}/recording`, {
        params: {
          query,
          inc: 'artist-credits+releases',
          fmt: 'json',
        },
        headers: {
          'User-Agent': 'FormalBridge/1.0.0',
        },
      })
      .then((response) => {
        if (!response.data || !response.data.recordings) {
          console.error('No recordings found in response:', response.data);
          return [] as MusicInfo[];
        }
        return (response.data.recordings || []).map((item: Recording) => {
          return {
            title: item.title,
            artist: item['artist-credit']?.[0]?.name || '',
            album: item.releases?.[0]?.title || '',
            mbid: item.id,
            albumCover: item.releases?.[0]?.id
              ? `https://coverartarchive.org/release/${item.releases[0].id}/front`
              : '',
          };
        });
      })
      .catch((error) => {
        console.error('MusicBrainz API Error:', error);
        return [] as MusicInfo[];
      });
  }

  public search(params: SearchParams): Promise<MusicInfo[]> {
    const queryParts = [];
    if (params.title) queryParts.push(`recording:${params.title}`);
    if (params.artist) queryParts.push(`artist:${params.artist}`);
    if (params.album) queryParts.push(`release:${params.album}`);

    const query = queryParts.join(' OR ');

    return this.searchBase(query);
  }

  public searchSongWithQuery(query: string): Promise<MusicInfo[]> {
    const tokens = query.match(/"[^"]*"|\S+/g) || []; // EX: 'Hello World "Nice to meet you"' -> ['Hello', 'World', '"Nice to meet you"']
    const searchTokens = tokens.length <= 3 ? tokens.map((token) => `${token}~`) : tokens;
    const searchQuery = searchTokens.join(' AND ');
    return this.searchBase(searchQuery);
  }
}
