import { useState } from 'react';

import type { MusicInfo } from 'app/external/music/IMusicSearchAPI';
import { searchMusic } from 'app/external/music/SearchMusic';
import styles from 'app/features/profile/pages/searchSong.module.scss';

const PLACEHOLDER = '/images/features/profile/album_default2.png';

interface Props {
  onSelect?: (song: MusicInfo, index: number) => void;
}

export default function SearchSongPage({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MusicInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsLoading(true);
    try {
      const songs = await searchMusic.searchSong({ title: trimmed });
      setResults(songs);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSearch} className={styles.formRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="노래 제목 / 아티스트..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className={styles.button} type="submit" disabled={isLoading}>
          {isLoading ? '검색 중...' : '검색'}
        </button>
      </form>

      <ul className={styles.songList}>
        {results.map((song, i) => (
          <li
            key={song.mbid ?? `${song.title}-${song.artist}`}
            className={styles.songItem}
            onClick={() => onSelect?.(song, i)}
          >
            <img src={song.albumCover || PLACEHOLDER} alt={song.album || 'Album cover'} className={styles.cover} />
            <div className={styles.texts}>
              <div className={styles.title}>{song.title}</div>
              <div className={styles.artist}>{song.artist}</div>
              <div className={styles.album}>{song.album}</div>
            </div>
          </li>
        ))}

        {results.length === 0 && !isLoading && <p className={styles.empty}>검색 결과가 없습니다.</p>}
      </ul>
    </div>
  );
}
