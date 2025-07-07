import { Link, useLoaderData } from '@remix-run/react';

import styles from './show.module.scss';
import SongItem from '../components/SongItem';

import type { loader as profileLoaderType } from '../../../routes/profile.$userId.show.tsx';

export default function Show() {
  const { user, userRankings } = useLoaderData<typeof profileLoaderType>();

  const isCurrentUserProfile = true; // Replace with actual logic to determine if it's the current user's profile

  return (
    <>
      <div className={styles.todayRecommendBox}>
        <div className={styles.titleBox}>
          <p className={styles.title}>👍 오늘의 추천곡</p>
          {isCurrentUserProfile && (
            <Link className={styles.goToEditLink} to="../addTodaySong">
              수정하기
            </Link>
          )}
        </div>
        <div className={styles.songBox}>
          {user.todayRecommendedSong ? (
            <SongItem song={user.todayRecommendedSong} />
          ) : (
            <p className={styles.noContentText}>오늘의 추천곡이 아직 없습니다.</p>
          )}
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
          {userRankings.length > 0 ? (
            userRankings.map((ranking) => <SongItem key={ranking.song.id} song={ranking.song} rank={ranking.rank} />)
          ) : (
            <p className={styles.noContentText}>아직 랭킹에 등록된 노래가 없습니다.</p>
          )}
        </div>
      </div>
    </>
  );
}
