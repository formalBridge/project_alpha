import { Link } from '@remix-run/react';

import styles from './show.module.scss';
import SongItem from '../components/SongItem';

export default function Show() {
  const isCurrentUserProfile = true; // Replace with actual logic to determine if it's the current user's profile

  return (
    <>
      <div className={styles.todayRecommendBox}>
        <div className={styles.titleBox}>
          <p className={styles.title}>👍 오늘의 추천곡</p>
          {isCurrentUserProfile && (
            <Link className={styles.goToEditLink} to="../editlist">
              수정하기
            </Link>
          )}
        </div>
        <div className={styles.songBox}>
          <SongItem />
        </div>
      </div>
      <div className={styles.todayRecommendBox}>
        <div className={styles.titleBox}>
          <p className={styles.title}>👑 노래 랭킹</p>
          {isCurrentUserProfile && (
            <Link className={styles.goToEditLink} to="../editlist">
              수정하기
            </Link>
          )}
        </div>
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
