import { Link, useLoaderData, useSearchParams, useFetcher } from '@remix-run/react';

import type { followsLoader } from 'app/features/profile/loader';

import styles from './follows.module.scss';
import { MusicNoteIcon } from '../../search/components/Icons';
import { UserForFollowList } from '../services';

export default function FollowsPage() {
  const { list, tab, currentUserId } = useLoaderData<typeof followsLoader>();
  const [searchParams] = useSearchParams();

  const getTabUrl = (tabName: 'followers' | 'following') => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tabName);
    return `?${newParams.toString()}`;
  };

  return (
    <div className={styles.followsPage}>
      <nav className={styles.nav}>
        <Link to={getTabUrl('followers')} className={`${styles.tab} ${tab === 'followers' ? styles.active : ''}`}>
          팔로워
        </Link>
        <Link to={getTabUrl('following')} className={`${styles.tab} ${tab === 'following' ? styles.active : ''}`}>
          팔로잉
        </Link>
      </nav>

      <section>
        {list.length === 0 ? (
          <p className={styles.emptyMessage}>
            {tab === 'followers' ? '아직 팔로워가 없습니다.' : '아직 팔로잉하는 사람이 없습니다.'}
          </p>
        ) : (
          <ul className={styles.list}>
            {list.map((user) => (
              <UserItem key={user.id} user={user} currentUserId={currentUserId} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function UserItem({ user, currentUserId }: { user: UserForFollowList; currentUserId: number | null }) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === 'submitting';

  const isFollowing = fetcher.formData ? fetcher.formData.get('intent') === 'follow' : user.isFollowing;

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
        {!isCurrentUser && (
          <fetcher.Form method="post">
            <input type="hidden" name="intent" value={isFollowing ? 'unfollow' : 'follow'} />
            <input type="hidden" name="targetUserId" value={user.id} />
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
