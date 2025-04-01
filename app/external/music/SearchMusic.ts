import { IMusicSearchAPI, SearchParams, MusicInfo } from "app/external/music/IMusicSearchAPI";

export class SearchMusic {
    constructor(private musicAPI: IMusicSearchAPI){}

    async searchSong(params: SearchParams): Promise<MusicInfo[]>{
        return this.musicAPI.search(params);
    }
}