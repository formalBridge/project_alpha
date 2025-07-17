import styles from './SongItem.module.scss';

export interface SimpleSong {
  id: number;
  title: string;
  artist: string;
  thumbnailUrl: string | null;
  album: string | null;
}

interface Props {
  song: SimpleSong;
  rank?: number;
}

export default function SongItem({ song, rank }: Props) {
  return (
    <div className={styles.songItem}>
      {rank !== undefined && <p className={styles.rank}>{rank}위</p>}

      <img
        className={styles.itemImage}
        src={song.thumbnailUrl || '/images/features/profile/album_default2.png'}
        alt={song.title || 'No Title'}
      />

      <div className={styles.itemTextBox}>
        <p className={styles.itemTitle}>{song.title}</p>
        <p className={styles.itemArtist}>{song.artist}</p>
      </div>
    </div>
  );
}
