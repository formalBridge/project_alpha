import type { Song } from '@prisma/client';

import styles from './SongItem.module.scss';

interface SongItemProps {
  song: Song;
  rank?: number;
}

export default function SongItem({ song, rank }: SongItemProps) {
  return (
    <div className={styles.songItem}>
      {rank !== undefined && <p className={styles.rank}>{rank}위</p>}

      <img
        className={styles['itemImage']}
        src={song.thumbnailUrl || '../../../public/images/features/profile/album_default2.png'}
        alt={song.title || 'No Title'}
      />

      <div className={styles.itemTextBox}>
        <p className={styles.itemTitle}>{song.title}</p>
        <p className={styles.itemArtist}>{song.artist}</p>
      </div>
    </div>
  );
}
