import type { Song } from '@prisma/client';
import { Link, useLoaderData } from '@remix-run/react';

import SongItem from 'app/features/profile/components/SongItem';
import { profileLoader } from 'app/features/profile/loader';
import styles from 'app/features/profile/pages/show.module.scss';

interface TodaySongSectionProps {
  song: Partial<Song> | null;
  isCurrentUserProfile: boolean;
}

export function TodaySongSection({ song, isCurrentUserProfile }: TodaySongSectionProps) {
  return (
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
        {song && song.title ? (
          <SongItem song={song as Song} />
        ) : (
          <p className={styles.noContentText}>오늘의 추천곡이 아직 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default function Show() {
  const { user, userRankings } = useLoaderData<typeof profileLoader>();

  const isCurrentUserProfile = true;

  return (
    <div>
      <div className={styles.profileBox}>
        <img className={styles.profileAvatar} src="/images/features/profile/profile_test.png" />
        <div className={styles.profileTextbox}>
          <p className={styles.profileName}>{user.name}</p>
          <p className={styles.profileHandle}>@{user.handle}</p>
        </div>
      </div>
      <div className={styles.contentBox}>
        <TodaySongSection song={user.todayRecommendedSong} isCurrentUserProfile={isCurrentUserProfile} />
        <div className={styles.todayRecommendBox} style={{ marginTop: '2rem' }}>
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
      </div>
    </div>
  );
}
