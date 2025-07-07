import type { Song } from '@prisma/client';

import styles from './SongItem.module.scss';

interface SongItemProps {
  song: Song;
  rank?: number;
}

export default function SongItem({ song, rank }: SongItemProps) {
  return (
    <div className={styles['song-item']}>
      {rank !== undefined && <p className={styles.rank}>{rank}위</p>}

      <img
        className={styles['item-image']}
        src={song.thumbnailUrl || '../../../public/images/features/profile/album_default2.png'}
        alt={song.title || 'No Title'}
      />

      <div className={styles['item-text-box']}>
        <p className={styles['item-title']}>{song.title}</p>
        <p className={styles['item-artist']}>{song.artist}</p>
      </div>
    </div>
  );
}
