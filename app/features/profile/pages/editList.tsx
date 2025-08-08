import { Link, useLoaderData, useSubmit } from '@remix-run/react';
import { useState } from 'react';

import type { MusicInfo } from 'app/external/music/IMusicSearchAPI';
import { type SimpleSong } from 'app/features/profile/components/SongItem';
import SongItem from 'app/features/profile/components/SongItem';
import styles from 'app/features/profile/pages/addTodaySong.module.scss';

import SearchSongInput from '../components/SearchSongInput';
import { editListLoader } from '../loader';

export default function EditListPage() {
  const { songs, userRankings } = useLoaderData<typeof editListLoader>();
  const [previewSong, setPreviewSong] = useState<SimpleSong | null>(null);
  const savePickedSong = useSavePickedSong(setPreviewSong);

  return (
    <div className={styles.container}>
      <Link to="../show">돌아가기</Link>

      <h1>노래 랭킹 수정</h1>

      <section className={styles.searchSection}>
        <h2>노래 검색</h2>
        <SearchSongInput onSelect={savePickedSong} songs={songs} />
      </section>

      {previewSong && (
        <section className={styles.previewSection}>
          <h2>선택한 곡 미리보기</h2>
          <SongItem song={previewSong} />
        </section>
      )}
      <section style={{ marginTop: 24 }}>
        <h2>내 랭킹 리스트</h2>
        {userRankings.length === 0 ? (
          <p>아직 등록된 곡이 없습니다.</p>
        ) : (
          <ol>
            {userRankings.map((r) => (
              <li key={r.id} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <span>#{r.rank}</span>
                <img
                  src={r.song.thumbnailUrl ?? '/images/features/profile/album_default2.png'}
                  alt={r.song.album ?? 'album'}
                  style={{ width: 40, height: 40, objectFit: 'cover' }}
                />
                <span>
                  {r.song.title} – {r.song.artist}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

const useSavePickedSong = (setPreviewSong: (song: SimpleSong) => void) => {
  const submit = useSubmit();

  return async (song: MusicInfo) => {
    const ok = window.confirm(`"${song.title}" – ${song.artist}\n노래 랭킹에 등록하시겠습니까?`);
    if (!ok) return;

    const simple: SimpleSong = {
      id: 0,
      title: song.title,
      artist: song.artist,
      album: song.album ?? null,
      thumbnailUrl: song.albumCover ? await song.albumCover : null,
    };
    setPreviewSong(simple);

    const fd = new FormData();
    fd.append('title', simple.title);
    fd.append('artist', simple.artist);
    fd.append('album', simple.album ?? '');
    fd.append('thumbnailUrl', simple.thumbnailUrl ?? '');
    submit(fd, { method: 'post' });
  };
};
