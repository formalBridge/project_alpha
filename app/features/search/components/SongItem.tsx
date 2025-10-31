import { Form } from '@remix-run/react';

import styles from './SongItem.module.scss';

export interface SimpleSong {
  id?: number;
  title: string;
  artist: string;
  thumbnailUrl?: string | null;
  album?: string | null;
  spotifyId?: string | null;
}

interface Props {
  song: SimpleSong;
}

export default function SongItem({ song }: Props) {
  const renderHiddenFieldsForSong = () => {
    if (song.id && song.id > 0) {
      return <input type="hidden" name="songId" value={String(song.id)} />;
    }

    return (
      <>
        <input type="hidden" name="title" value={song.title ?? ''} />
        <input type="hidden" name="artist" value={song.artist ?? ''} />
        <input type="hidden" name="album" value={song.album ?? ''} />
        <input type="hidden" name="thumbnailUrl" value={song.thumbnailUrl ?? ''} />
        <input type="hidden" name="spotifyId" value={song.spotifyId ?? ''} />
      </>
    );
  };

  const confirmAddToday = (e: React.FormEvent<HTMLFormElement>) => {
    const ok = window.confirm(`"${song.title}" – ${song.artist}\n오늘의 추천곡으로 등록하시겠습니까?`);
    if (!ok) e.preventDefault();
  };

  const confirmCreateMemo = (e: React.FormEvent<HTMLFormElement>) => {
    const ok = window.confirm(`"${song.title}" – ${song.artist}\n이 곡을 메모로 추가하시겠습니까?`);
    if (!ok) e.preventDefault();
  };

  return (
    <div className={styles.songItem}>
      <img
        className={styles.itemImage}
        src={song.thumbnailUrl || '/images/features/profile/album_default2.png'}
        alt={song.title || 'No Title'}
      />

      <div className={styles.itemTextBox}>
        <p className={styles.itemTitle}>{song.title}</p>
        <p className={styles.itemArtist}>{song.artist}</p>
      </div>

      <div className={styles.actions}>
        <Form method="post" onSubmit={confirmAddToday}>
          <input type="hidden" name="_action" value="addToday" />
          {renderHiddenFieldsForSong()}
          <button type="submit" className={styles.addTodayButton} aria-label="오늘의 추천곡 등록하기">
            오늘의 추천곡
          </button>
        </Form>

        <Form method="post" onSubmit={confirmCreateMemo}>
          <input type="hidden" name="_action" value="createMemo" />
          {renderHiddenFieldsForSong()}
          <button type="submit" className={styles.memoButton} aria-label="메모하기">
            메모
          </button>
        </Form>
      </div>
    </div>
  );
}
