import { Song } from '@prisma/client';

import styles from './MemoGridItem.module.scss';

interface MemoGridItemProps {
  song: Song;
}

export default function MemoGridItem({ song }: MemoGridItemProps) {
  return (
    <div className={styles.memoGridItem}>
      <img
        className={styles.itemImage}
        src={song.thumbnailUrl ?? '/images/features/profile/album_default2.png'}
        alt={`${song.title}`}
      />
      <div className={styles.infoOverlay}>
        <p className={styles.title}>{song.title}</p>
        <p className={styles.artist}>{song.artist}</p>
      </div>
    </div>
  );
}
