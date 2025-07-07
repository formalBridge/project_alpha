import axios from 'axios';

import { MusicInfo, Recording, SearchParams } from './IMusicSearchAPI';

export class MusicBrainzAPI {
  private BASE_URL = 'https://musicbrainz.org/ws/2';

  async search(params: SearchParams): Promise<MusicInfo[]> {
    const queryParts = [];
    if (params.title) {
      queryParts.push(`recording:${params.title}`);
    }
    if (params.artist) {
      queryParts.push(`artist:${params.artist}`);
    }
    if (params.album) {
      queryParts.push(`release:${params.album}`);
    }

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

    const recordings = (response.data.recordings || []) as Recording[];

    const results = await Promise.all(
      recordings.map(async (item) => {
        const title = item.title;
        const artist = item['artist-credit']?.[0]?.name || '';
        const album = item.releases?.[0]?.title || '';
        const mbid = item.id;
        const releaseId = item.releases?.[0]?.id;

        let albumCover;
        if(releaseId){
          try{
            const coverRes = await axios.get(`http://coverartarchive.org/release/${releaseId}`);
            albumCover = coverRes.data.images?.[0]?.image;
          } catch (e) {
            albumCover = undefined;
          }
        }
        return { title, artist, album, mbid, albumCover }; 
        
      })
    )

    return results;
  }
}
