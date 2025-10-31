import { Await, useNavigate, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';

import { SearchBar } from 'app/components/SearchBar';
import { MusicInfo } from 'app/external/music/IMusicSearchAPI';
import SongItem, { type SimpleSong } from 'app/features/search/components/SongItem';

import styles from './search.module.scss';
import { searchLoader } from '../loader';

const PLACEHOLDER = '/images/features/profile/album_default2.png';

export default function SearchPage() {
  const { query, songs } = useLoaderData<typeof searchLoader>();
  const navigate = useNavigate();

  return (
    <div className={styles.pageRow}>
      <div className={styles.side}>
        <button type="button" className={styles.backButton} aria-label="뒤로가기" onClick={() => navigate(-1)}>
          ＜ 이전
        </button>
      </div>
      <div className={styles.content}>
        <SearchBar defaultQuery={query} />
        <SearchedSongList songs={songs} />
      </div>
    </div>
  );
}

const SearchedSongList = ({ songs }: { songs: Promise<MusicInfo[]> | undefined }) => {
  return (
    <ul className={styles.songList}>
      <Suspense>
        <Await resolve={songs}>
          {(resolvedSongs) => (
            <>
              {resolvedSongs?.length === 0 && <p className={styles.empty}>검색 결과가 없습니다.</p>}
              {resolvedSongs?.map((song, idx) => (
                <li key={song.mbid ?? `${song.title}-${song.artist}-${idx}`} className={styles.songItem}>
                  <Suspense fallback={<img src={PLACEHOLDER} alt="Album cover" className={styles.cover} />}>
                    <Await resolve={song.albumCover}>
                      {(albumCover) => {
                        const simple: SimpleSong = {
                          id: idx,
                          title: song.title,
                          artist: song.artist,
                          thumbnailUrl: albumCover ?? null,
                          album: song.album ?? null,
                        };
                        return <SongItem song={simple} />;
                      }}
                    </Await>
                  </Suspense>
                </li>
              ))}
            </>
          )}
        </Await>
      </Suspense>
    </ul>
  );
};
