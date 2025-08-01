import { Await } from '@remix-run/react';
import { Suspense, useState, useTransition } from 'react';

import type { MusicInfo } from 'app/external/music/IMusicSearchAPI';
import { searchMusic } from 'app/external/music/SearchMusic';
import styles from 'app/features/profile/pages/searchSong.module.scss';

const PLACEHOLDER = '/images/features/profile/album_default2.png';

interface Props {
  onSelect: (song: MusicInfo, index: number) => void;
}

export default function SearchSongInput({ onSelect }: Props) {
  const { query, setQuery, searchSong, results, isSearching } = useSearchSong();

  return (
    <div className={styles.wrapper}>
      <form onSubmit={searchSong} className={styles.formRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="노래 제목 / 아티스트..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className={styles.button} disabled={isSearching}>
          {isSearching ? '검색 중...' : '검색'}
        </button>
      </form>

      <SearchedSongList songs={results} onSelect={onSelect} isSearching={isSearching} />
    </div>
  );
}

const useSearchSong = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MusicInfo[]>([]);
  const [isSearching, startTransition] = useTransition();

  const searchSong = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchQuery = query.trim();
    if (!searchQuery) {
      return;
    }
    startTransition(() => searchMusic.searchSongWithQuery(searchQuery).then((songs) => setResults(songs)));
  };

  return { query, setQuery, searchSong, results, isSearching };
};

const SearchedSongList = ({
  songs,
  onSelect,
  isSearching,
}: {
  songs: MusicInfo[];
  onSelect: (song: MusicInfo, index: number) => void;
  isSearching: boolean;
}) => {
  return (
    <ul className={styles.songList}>
      {songs.map((song, i) => (
        <li
          key={song.mbid ?? `${song.title}-${song.artist}`}
          className={styles.songItem}
          onClick={() => onSelect(song, i)}
        >
          <Suspense fallback={<img src={PLACEHOLDER} alt="Album cover" className={styles.cover} />}>
            <Await resolve={song.albumCover}>
              {(albumCover) => <img src={albumCover || PLACEHOLDER} alt={song.album} className={styles.cover} />}
            </Await>
          </Suspense>
          <div className={styles.texts}>
            <div className={styles.title}>{song.title}</div>
            <div className={styles.artist}>{song.artist}</div>
            <div className={styles.album}>{song.album}</div>
          </div>
        </li>
      ))}

      {songs.length === 0 && !isSearching && <p className={styles.empty}>검색 결과가 없습니다.</p>}
    </ul>
  );
};
