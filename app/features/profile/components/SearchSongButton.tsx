import type { Song } from '@prisma/client';
import { debounce } from 'es-toolkit';
import { useState } from 'react';

import { searchMusic } from 'app/external/music/SearchMusic';
import styles from 'app/features/profile/components/SongItem.module.scss';

interface Props {
  onSelectSong: (song: Partial<Song>) => void;
}

export default function SearchSongButton({ onSelectSong }: Props) {
  const [query, setQuery] = useState('');
  const [results, setRes] = useState<Partial<Song>[]>([]);
  const [loading, setLoad] = useState(false);
  const [open, setOpen] = useState(false);

  const runSearch = debounce(async (q: string) => {
    if (!q.trim()) return setRes([]);
    setLoad(true);
    try {
      const musics = await searchMusic.searchSong({ title: q });
      setRes(
        musics.map((m) => ({
          title: m.title,
          artist: m.artist,
          album: m.album,
          thumbnailUrl: m.albumCover,
        }))
      );
    } finally {
      setLoad(false);
    }
  }, 300);

  return (
    <div className={styles.wrapper}>
      <button onClick={() => setOpen((o) => !o)} className={styles.trigger}>
        노래 검색
      </button>

      {open && (
        <div className={styles.dropdown}>
          <input
            className={styles.input}
            placeholder="제목 / 아티스트"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              runSearch(e.target.value);
            }}
          />

          {loading && <p className={styles.loading}>검색 중…</p>}

          <ul className={styles.list}>
            {results.map((s, i) => (
              <li
                key={`${s.title}-${s.artist}-${i}`}
                className={styles.item}
                onClick={() => {
                  onSelectSong(s);
                  setOpen(false);
                  setQuery('');
                  setRes([]);
                }}
              >
                {s.title} – {s.artist}
              </li>
            ))}
            {!loading && query && results.length === 0 && <li className={styles.noResult}>검색 결과 없음</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
