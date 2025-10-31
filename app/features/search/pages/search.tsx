import { Await, useNavigate, useLoaderData, useSearchParams } from '@remix-run/react';
import { Suspense } from 'react';

import { SearchBar } from 'app/components/SearchBar';
import { UserItem } from 'app/components/UserItem';
import { MusicInfo } from 'app/external/music/IMusicSearchAPI';
import MemoItem from 'app/features/search/components/MemoItem';
import SongItem, { SimpleSong } from 'app/features/search/components/SongItem';

import styles from './search.module.scss';
import { searchLoader } from '../loader';
import { UserMusicMemoWithRelations, UserWithRecommendedSong } from '../services';

type SearchUser = UserWithRecommendedSong & { isFollowing?: boolean | null };
type Tab = 'music' | 'memo' | 'handle';

const PLACEHOLDER = '/images/features/profile/album_default2.png';

type Results = MusicInfo[] | SearchUser[] | UserMusicMemoWithRelations[];

export default function SearchPage() {
  const { query, results } = useLoaderData<typeof searchLoader>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = (searchParams.get('tab') ?? 'music') as Tab;

  const switchTab = (t: Tab) => {
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
        <SearchHeader defaultQuery={query} tab={tab} onSwitchTab={switchTab} />

        <ResultsArea tab={tab} results={results as Results | null} query={query} isEmpty={isResultsEmpty} />
      </div>
    </div>
  );
}

function SearchHeader({
  defaultQuery,
  tab,
  onSwitchTab,
}: {
  defaultQuery: string;
  tab: Tab;
  onSwitchTab: (t: Tab) => void;
}) {
  return (
    <div className={styles.searchHeader}>
      <SearchBar defaultQuery={defaultQuery} tab={tab} />
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${tab === 'music' ? styles.active : ''}`}
          onClick={() => onSwitchTab('music')}
        >
          음악
        </button>
        <button
          type="button"
          className={`${styles.tab} ${tab === 'memo' ? styles.active : ''}`}
          onClick={() => onSwitchTab('memo')}
        >
          메모
        </button>
        <button
          type="button"
          className={`${styles.tab} ${tab === 'handle' ? styles.active : ''}`}
          onClick={() => onSwitchTab('handle')}
        >
          사용자
        </button>
      </div>
    </div>
  );
}

function ResultsArea({
  tab,
  results,
  query,
  isEmpty,
}: {
  tab: Tab;
  results: Results | null;
  query: string;
  isEmpty: boolean;
}) {
  if (isEmpty) {
    return <p className={styles.empty}>{`"${query}"에 대한 검색 결과가 없습니다.`}</p>;
  }

  const isMusicResults = (r: Results | null): r is MusicInfo[] =>
    Array.isArray(r) &&
    r.length > 0 &&
    typeof (r[0] as MusicInfo).title === 'string' &&
    typeof (r[0] as MusicInfo).artist === 'string';

  const isUserResults = (r: Results | null): r is SearchUser[] =>
    Array.isArray(r) && r.length > 0 && typeof (r[0] as SearchUser).handle === 'string';

  const isMemoResults = (r: Results | null): r is UserMusicMemoWithRelations[] =>
    Array.isArray(r) && r.length > 0 && ('content' in r[0] || 'songId' in r[0]);

  if (tab === 'music' && isMusicResults(results)) return <SearchedSongList songs={results} />;
  if (tab === 'handle' && isUserResults(results)) return <UserList users={results} />;
  if (tab === 'memo' && isMemoResults(results)) return <MemoList memos={results} />;

  if (tab === 'music') return <SearchedSongList songs={[] as MusicInfo[]} />;
  if (tab === 'handle') return <UserList users={[] as SearchUser[]} />;
  return <MemoList memos={[] as UserMusicMemoWithRelations[]} />;
}

function UserList({ users }: { users: SearchUser[] }) {
  return (
    <ul className={styles.profileGrid}>
      {users.map((user) => (
        <UserItem key={user.id} user={user} showFollow={false} />
      ))}
    </ul>
  );
}

function MemoList({ memos }: { memos: UserMusicMemoWithRelations[] }) {
  return (
    <ul className={styles.listContainer}>
      {memos.map((m) => (
        <li key={m.id}>
          <MemoItem memo={m} />
        </li>
      ))}
    </ul>
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
