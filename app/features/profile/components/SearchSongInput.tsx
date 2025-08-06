import { Await } from '@remix-run/react';
import { Suspense } from 'react';

import type { MusicInfo } from 'app/external/music/IMusicSearchAPI';
import { searchMusic } from 'app/external/music/SearchMusic';
import styles from 'app/features/profile/pages/searchSong.module.scss';

const PLACEHOLDER = '/images/features/profile/album_default2.png';

interface Props {
  songs: Promise<MusicInfo[]> | undefined;
  onSelect: (song: MusicInfo, index: number) => void;
}

export default function SearchSongInput({ onSelect, songs }: Props) {
  return (
    <div className={styles.wrapper}>
      <form className={styles.formRow}>
        <input className={styles.input} type="text" name="query" placeholder="노래 제목 / 아티스트..." />
        <button type="submit" className={styles.button}>
          검색
        </button>
      </form>

      <SearchedSongList songs={songs} onSelect={onSelect} />
    </div>
  );
}

const SearchedSongList = ({
  songs,
  onSelect,
}: {
  songs: Promise<MusicInfo[]> | undefined;
  onSelect: (song: MusicInfo, index: number) => void;
}) => {
  return (
    <ul className={styles.songList}>
      <Suspense fallback={<p className={styles.loading}>검색 중...</p>}>
        <Await resolve={songs}>
          {(resolvedSongs) => (
            <>
              {resolvedSongs?.length === 0 && <p className={styles.empty}>검색 결과가 없습니다.</p>}
              {resolvedSongs?.map((song, i) => (
                <li
                  key={song.mbid ?? `${song.title}-${song.artist}`}
                  className={styles.songItem}
                  onClick={() => onSelect(song, i)}
                >
                  <Suspense fallback={<img src={PLACEHOLDER} alt="Album cover" className={styles.cover} />}>
                    <Await resolve={song.albumCover}>
                      {(albumCover) => (
                        <img src={albumCover || PLACEHOLDER} alt={song.album} className={styles.cover} />
                      )}
                    </Await>
                  </Suspense>
                  <div className={styles.texts}>
                    <div className={styles.title}>{song.title}</div>
                    <div className={styles.artist}>{song.artist}</div>
                    <div className={styles.album}>{song.album}</div>
                  </div>
                </li>
              ))}
            </>
          )}
        </Await>
      </Suspense>
    </ul>
  );
};

export const searchSongInputLoader = ({ request }: { request: Request }) => {
  const searchQuery = new URL(request.url).searchParams.get('query');
  if (!searchQuery) {
    return undefined;
  }

  return searchMusic.searchSongWithQuery(searchQuery);
};
