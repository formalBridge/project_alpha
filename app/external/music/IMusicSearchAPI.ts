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
  spotifyId: string;
  albumCover?: Promise<string>;
}

export interface ArtistCredit {
  name: string;
}

export interface Release {
  title: string;
  id: string;
}

export interface Recording {
  id: string;
  title: string;
  'artist-credit'?: ArtistCredit[];
  releases?: Release[];
}
