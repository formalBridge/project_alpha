export interface SearchParams {
  title?: string;
  artist?: string;
  album?: string;
}

export interface MusicInfo {
  title: string;
  artist: string;
  album: string;
  mbid?: string;
}

export interface IMusicSearchAPI {
  search(params: SearchParams): Promise<MusicInfo[]>;
}

export interface ArtistCredit {
  name: string;
}

export interface Release {
  title: string;
}

export interface Recording {
  id: string;
  title: string;
  'artist-credit'?: ArtistCredit[];
  releases?: Release[];
}