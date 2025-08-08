import { Link, useLoaderData, useSubmit } from '@remix-run/react';

import type { MusicInfo } from 'app/external/music/IMusicSearchAPI';
import SongItem, { type SimpleSong } from 'app/features/profile/components/SongItem';
import styles from 'app/features/profile/pages/addTodaySong.module.scss';

import SearchSongInput from '../components/SearchSongInput';
import { addTodaySongLoader } from '../loader';

export default function AddTodaySongPage() {
  const { initialSong, songs } = useLoaderData<typeof addTodaySongLoader>();
  const savePickedSong = useSavePickedSong();

  return (
    <div className={styles.addTodaySongContainer}>
      <div className={styles.titleBox}>
        <Link className={styles.backButton} to="../show">
          {'<'}
        </Link>
        <h1 className={styles.title}>오늘의 추천곡 수정</h1>
      </div>

      <section className={styles.searchSection}>
        <SearchSongInput onSelect={savePickedSong} songs={songs} />
      </section>

      {initialSong && (
        <div className={styles.initialSongContainer}>
          <h3>현재 추천곡</h3>
          <SongItem song={initialSong} />
        </div>
      )}
    </div>
  );
}

const useSavePickedSong = () => {
  const submit = useSubmit();

  return async (song: MusicInfo) => {
    const ok = window.confirm(`"${song.title}" – ${song.artist}\n오늘의 추천곡으로 등록하시겠습니까?`);
    if (!ok) return;

    const simple: SimpleSong = {
      id: 0,
      title: song.title,
      artist: song.artist,
      album: song.album ?? null,
      thumbnailUrl: song.albumCover ? await song.albumCover : null,
    };

    const fd = new FormData();
    fd.append('title', simple.title);
    fd.append('artist', simple.artist);
    fd.append('album', simple.album ?? '');
    fd.append('thumbnailUrl', simple.thumbnailUrl ?? '');
    submit(fd, { method: 'post' });
  };
};
