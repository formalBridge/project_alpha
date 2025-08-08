import { Link } from '@remix-run/react';

import { ChevronRightIcon, MusicNoteIcon } from './Icons';
import styles from './ProfileCard.module.scss';
import { UserWithRecommendedSong } from '../services';

export function ProfileCard({ user }: { user: UserWithRecommendedSong }) {
  return (
    <Link to={`/profile/${user.id}/show`} key={user.id} className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.profileInfo}>
          <img
            src={'https://placehold.co/40x40/ecf0f1/bdc3c7?text=...'} // TODO: avartarUrl 넣기
            alt={`${user.name}의 프로필 사진`}
            className={styles.avatar}
          />
          <div className={styles.userInfo}>
            <p className={styles.handle}>@{user.handle}</p>
            <p className={styles.name}>{user.name}</p>
          </div>
        </div>
        <div className={styles.chevron}>
          <ChevronRightIcon />
        </div>
      </div>

      {user.todayRecommendedSong ? (
        <div className={styles.todaysPick}>
          <img
            src={user.todayRecommendedSong.thumbnailUrl ?? 'https://placehold.co/36x36/ecf0f1/bdc3c7?text=...'}
            alt={`${user.todayRecommendedSong.artist} - ${user.todayRecommendedSong.title} 앨범 아트`}
            className={styles.songThumbnail}
          />
          <div className={styles.songText}>
            <p className={styles.song} title={user.todayRecommendedSong.title}>
              {user.todayRecommendedSong.title}
            </p>
            <p className={styles.artist}>{user.todayRecommendedSong.artist}</p>
          </div>
        </div>
      ) : (
        <div className={styles.noSongPlaceholder}>
          <MusicNoteIcon />
          <p>추천곡 없음</p>
        </div>
      )}
    </Link>
  );
}
