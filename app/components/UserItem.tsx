import { Link, useFetcher } from '@remix-run/react';

import { MusicNoteIcon } from 'app/features/search/components/Icons';

import styles from './UserItem.module.scss';

interface RecommendedSong {
  id: number;
  title: string;
  artist: string;
  thumbnailUrl?: string | null;
}

export interface UserItemUser {
  id: number;
  handle: string;
  avatarUrl?: string | null;
  isFollowing?: boolean | null;
  todayRecommendedSong?: RecommendedSong | null;
}

export interface UserItemProps {
  user: UserItemUser;
  currentUserId?: number | null;
  showFollow?: boolean;
}

export function UserItem({ user, currentUserId = null, showFollow = true }: UserItemProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === 'submitting';
  const isFollowing = fetcher.formData ? fetcher.formData.get('intent') === 'follow' : !!user.isFollowing;
  const isCurrentUser = currentUserId === user.id;

  return (
    <li className={styles.userItem}>
      <div className={styles.userInfo}>
        <Link to={`/profile/${user.id}/show`} className={styles.userLink}>
          <img
            src={user.avatarUrl || '/images/features/profile/profile_default.png'}
            alt={`${user.handle}의 프로필 사진`}
            className={styles.avatar}
          />
          <span className={styles.handle}>@{user.handle}</span>
        </Link>

        {showFollow && !isCurrentUser && (
          <fetcher.Form method="post">
            <input type="hidden" name="intent" value={isFollowing ? 'unfollow' : 'follow'} />
            <input type="hidden" name="targetUserId" value={String(user.id)} />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${styles.followButton} ${isFollowing ? styles.unfollow : styles.follow}`}
            >
              {isFollowing ? '언팔로우' : '팔로우'}
            </button>
          </fetcher.Form>
        )}
      </div>

      {user.todayRecommendedSong ? (
        <Link to={`/music/${user.todayRecommendedSong.id}/user/${user.id}`} className={styles.recommendedSong}>
          <img
            src={user.todayRecommendedSong.thumbnailUrl ?? 'https://placehold.co/36x36/ecf0f1/bdc3c7?text=...'}
            alt={user.todayRecommendedSong.title}
            className={styles.recommendedSong__thumbnail}
          />
          <div className={styles.recommendedSong__details}>
            <span className={styles.recommendedSong__title}>{user.todayRecommendedSong.title}</span>
            <span className={styles.recommendedSong__artist}>{user.todayRecommendedSong.artist}</span>
          </div>
        </Link>
      ) : (
        <div className={styles.noSongPlaceholder}>
          <MusicNoteIcon />
          <p>추천곡 없음</p>
        </div>
      )}
    </li>
  );
}
