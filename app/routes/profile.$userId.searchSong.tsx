import { useState } from "react";
import type { MusicInfo } from "app/external/music/IMusicSearchAPI";
import { searchMusic } from "app/external/music/SearchMusic";
import styles from "app/features/profile/pages/searchSong.module.scss";

const PLACEHOLDER = "/images/features/profile/album_default2.png";

export default function SearchSongPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MusicInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /* ── 검색 ──────────────────────────────── */
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

  /* ── 곡 선택 ───────────────────────────── */
  const handleSelect = (song: MusicInfo, index: number) => {
    // 화면 알림창으로 클릭 정보 표시
    alert(`선택 ${index + 1} : ${song.title}  –  ${song.artist}`);
    // TODO: fetcher.submit(...) 등으로 addTodaySong 호출
  };

  return (
    <div className={styles.searchWrapper}>
      {/* 입력폼 */}
      <form onSubmit={handleSearch} className={styles.formRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="노래 제목 / 아티스트..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className={styles.button} type="submit" disabled={isLoading}>
          {isLoading ? "검색 중..." : "검색"}
        </button>
      </form>

      {/* 결과 리스트 */}
      <ul className={styles.songList}>
        {results.map((song, i) => {
          const coverUrl = PLACEHOLDER;

          /* 🔄 실제 커버아트를 다시 쓰려면 아래 3줄을 복원하고
             위의 coverUrl 를 주석 처리하세요.
          const coverUrl = song.mbid
            ? `https://coverartarchive.org/release/${song.mbid}/front-250`
            : PLACEHOLDER;
          */

          return (
            <li
              key={song.mbid ?? `${song.title}-${song.artist}`}
              className={styles.songItem}
              onClick={() => handleSelect(song, i)}   // 인덱스 추가 전달
            >
              <img
                src={coverUrl}
                alt={song.album || "Album placeholder"}
                className={styles.cover}
              />
              <div className={styles.texts}>
                <div className={styles.title}>{song.title}</div>
                <div className={styles.artist}>{song.artist}</div>
                <div className={styles.album}>{song.album}</div>
              </div>
            </li>
          );
        })}

        {results.length === 0 && !isLoading && (
          <p className={styles.empty}>검색 결과가 없습니다.</p>
        )}
      </ul>
    </div>
  );
}
