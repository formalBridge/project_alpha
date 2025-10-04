import axios from 'axios';

import { MusicInfo, SearchParams } from './IMusicSearchAPI';

const clientId = process.env.SPOTIFY_CLIENT_ID || '';
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '';

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
}

export class SpotifyAPI {
  private BASE_URL = 'https://api.spotify.com/v1';
  private ACCOUNTS_URL = 'https://accounts.spotify.com/api/token';

  private accessToken: string | null = null;
  private tokenExpiresAt = 0;

  constructor() {
    if (!clientId || !clientSecret) {
      console.error('Spotify Client ID 또는 Client Secret이 설정되지 않았습니다. 환경변수를 확인해주세요.');
    }
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    const authHeader = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;

    try {
      const response = await axios.post(this.ACCOUNTS_URL, 'grant_type=client_credentials', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: authHeader,
        },
      });

      const { access_token, expires_in } = response.data;
      this.accessToken = access_token as string;
      this.tokenExpiresAt = Date.now() + (expires_in - 300) * 1000;

      return this.accessToken;
    } catch (error) {
      console.error('Spotify Access Token 발급 오류:', error);
      throw new Error('Spotify 인증에 실패했습니다.');
    }
  }

  private async searchBase(query: string): Promise<MusicInfo[]> {
    console.log(this.accessToken);
    try {
      const token = await this.getAccessToken();

      const response = await axios.get(`${this.BASE_URL}/search`, {
        params: {
          q: query,
          type: 'track',
          limit: 20,
          market: 'KR',
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept-Language': 'ko-KR, ko;q=0.9',
        },
        timeout: 5000,
      });

      if (!response.data || !response.data.tracks) {
        console.error('No tracks found in response:', response.data);
        return [];
      }

      return (response.data.tracks.items || []).map((item: SpotifyTrack) => ({
        title: item.name,
        artist: item.artists?.[0]?.name || '',
        album: item.album.name,
        mbid: item.id,
        spotifyId: item.id,
        albumCover: item.album.images?.[0]?.url || '',
      }));
    } catch (error) {
      console.error('Spotify API Error:', error);
      return [];
    }
  }

  public search(params: SearchParams): Promise<MusicInfo[]> {
    const queryParts = [];
    if (params.title) queryParts.push(`track:"${params.title}"`);
    if (params.artist) queryParts.push(`artist:"${params.artist}"`);
    if (params.album) queryParts.push(`album:"${params.album}"`);

    const query = queryParts.join(' ');

    return this.searchBase(query);
  }

  public searchSongWithQuery(query: string): Promise<MusicInfo[]> {
    return this.searchBase(query);
  }
}
