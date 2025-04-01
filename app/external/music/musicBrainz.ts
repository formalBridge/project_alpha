import axios from 'axios';

import { IMusicSearchAPI, MusicInfo, SearchParams } from './IMusicSearchAPI';

export class MusicBrainzAPI implements IMusicSearchAPI {
  private BASE_URL = 'https://musicbrainz.org/ws/2';

  async search(params: SearchParams): Promise<MusicInfo[]> {
    const queryParts = [];
    if (params.title) queryParts.push(`recording:${params.title}`);
    if (params.artist) queryParts.push(`artist:${params.artist}`);
    if (params.album) queryParts.push(`release:${params.album}`);

    const query = queryParts.join(' AND ');

    const response = await axios.get(`${this.BASE_URL}/recording`, {
      params: {
        query,
        fmt: 'json',
      },
      headers: {
        'User-Agent': 'FormalBridge/1.0.0',
      },
    });

    return (response.data.recordings || []).map((item: any) => ({
      title: item.title,
      artist: item['artist-credit']?.[0]?.name || 'unknown',
      album: item.releases?.[0]?.title || 'unknown',
      mbid: item.id,
    }));
  }
}
