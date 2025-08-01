import { Link, useSubmit } from '@remix-run/react';
import { useState } from 'react';

import type { MusicInfo } from 'app/external/music/IMusicSearchAPI';
import { type SimpleSong } from 'app/features/profile/components/SongItem';
import SongItem from 'app/features/profile/components/SongItem';
import styles from 'app/features/profile/pages/addTodaySong.module.scss';

import SearchSongInput from '../components/SearchSongInput';

interface AddTodaySongProps {
  initialSong: SimpleSong | null;
}

export default function AddTodaySongPage({ initialSong }: AddTodaySongProps) {
  const [previewSong, setPreviewSong] = useState<SimpleSong | null>(initialSong);
  const submit = useSubmit();

  const handleSongPicked = (song: MusicInfo) => {
    const ok = window.confirm(`"${song.title}" – ${song.artist}\n오늘의 추천곡으로 등록하시겠습니까?`);
    if (!ok) return;

    const simple: SimpleSong = {
      id: 0,
      title: song.title,
      artist: song.artist,
      album: song.album ?? null,
      thumbnailUrl: song.albumCover ?? null,
    };
    setPreviewSong(simple);

    const fd = new FormData();
    fd.append('title', simple.title);
    fd.append('artist', simple.artist);
    fd.append('album', simple.album ?? '');
    fd.append('thumbnailUrl', simple.thumbnailUrl ?? '');
    submit(fd, { method: 'post' });
  };

  return (
    <div className={styles.container}>
      <Link to="../show">돌아가기</Link>

      <h1>오늘의 추천곡 수정</h1>

      <section className={styles.searchSection}>
        <h2>노래 검색</h2>
        <SearchSongInput onSelect={handleSongPicked} />
      </section>

      {previewSong && (
        <section className={styles.previewSection}>
          <h2>선택한 곡 미리보기</h2>
          <SongItem song={previewSong} />
        </section>
      )}
    </div>
  );
}
