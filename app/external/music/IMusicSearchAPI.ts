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
