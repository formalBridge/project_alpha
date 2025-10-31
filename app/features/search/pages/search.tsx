import { Await, useNavigate, useLoaderData, useSearchParams } from '@remix-run/react';
import { Suspense } from 'react';

import { SearchBar } from 'app/components/SearchBar';
import { UserItem } from 'app/components/UserItem';
import { MusicInfo } from 'app/external/music/IMusicSearchAPI';
import SongItem, { SimpleSong } from 'app/features/search/components/SongItem';

import styles from './search.module.scss';
import { searchLoader } from '../loader';

import type { UserWithRecommendedSong } from '../services';

type SearchUser = UserWithRecommendedSong & { isFollowing?: boolean | null };

const PLACEHOLDER = '/images/features/profile/album_default2.png';

export default function SearchPage() {
  const { query, results } = useLoaderData<typeof searchLoader>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') ?? 'music';

  const switchTab = (t: 'music' | 'handle') => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', t);
    setSearchParams(next);
  };

  const isResultsEmpty = !results || (Array.isArray(results) && results.length === 0);

  return (
    <div className={styles.pageRow}>
      <div className={styles.side}>
        <button type="button" className={styles.backButton} aria-label="뒤로가기" onClick={() => navigate(-1)}>
          ＜ 이전
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.searchHeader}>
          <SearchBar defaultQuery={query} tab={tab} />
          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tab} ${tab === 'music' ? styles.active : ''}`}
              onClick={() => switchTab('music')}
            >
              음악
            </button>
            <button
              type="button"
              className={`${styles.tab} ${tab === 'handle' ? styles.active : ''}`}
              onClick={() => switchTab('handle')}
            >
              사용자
            </button>
          </div>
        </div>

        {isResultsEmpty ? (
          <p className={styles.empty}>{`"${query}"에 대한 검색 결과가 없습니다.`}</p>
        ) : tab === 'music' ? (
          <SearchedSongList songs={results as MusicInfo[]} />
        ) : (
          <ul className={styles.profileGrid}>
            {((results as SearchUser[]) || []).map((user) => (
              <UserItem key={user.id} user={user} showFollow={false} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const SearchedSongList = ({ songs }: { songs: MusicInfo[] }) => {
  return (
    <ul className={styles.listContainer}>
      {songs.map((song, idx) => (
        <li key={song.mbid ?? `${song.title}-${song.artist}-${idx}`} className={styles.songItem}>
          <Suspense fallback={<img src={PLACEHOLDER} alt="Album cover" className={styles.cover} />}>
            <Await resolve={song.albumCover}>
              {(albumCover) => {
                const simple: SimpleSong = {
                  id: 0,
                  title: song.title,
                  artist: song.artist,
                  thumbnailUrl: albumCover ?? null,
                  album: song.album ?? null,
                  spotifyId: song.spotifyId ?? null,
                };
                return <SongItem song={simple} />;
              }}
            </Await>
          </Suspense>
        </li>
      ))}
    </ul>
  );
};
