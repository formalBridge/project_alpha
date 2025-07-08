import axios from 'axios';

import { MusicInfo, Recording, SearchParams } from './IMusicSearchAPI';

export class MusicBrainzAPI {
  private BASE_URL = 'https://musicbrainz.org/ws/2';

  private async getAlbumCover(releaseId: string): Promise<string> {
    try {
      const coverRes = await axios.get(`http://coverartarchive.org/release/${releaseId}`);
      return coverRes.data.images?.[0]?.image ?? '';
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return '';
      }
      throw error;
    }
  }

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

    return await Promise.all(
      (response.data.recordings || []).map(async (item: Recording) => {
        return {
          title: item.title,
          artist: item['artist-credit']?.[0]?.name || '',
          album: item.releases?.[0]?.title || '',
          mbid: item.id,
          albumCover: item.releases?.[0]?.id ? await this.getAlbumCover(item.releases?.[0].id) : '',
        };
      })
    );
  }
}
