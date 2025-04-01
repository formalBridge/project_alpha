import styles from './show.module.scss';
import SongItem from '../components/SongItem';

export default function Show() {
  return (
    <>
      <div className={styles.todayRecommendBox}>
        <p className={styles.title}>👍 오늘의 추천곡</p>
        <div className={styles.songBox}>
          <SongItem />
        </div>
      </div>
      <div className={styles.todayRecommendBox}>
        <p className={styles.title}>👑 노래 랭킹</p>
        <div className={styles.songBox}>
          <SongItem />
          <SongItem />
          <SongItem />
          <SongItem />
        </div>
      </div>
    </>
  );
}
