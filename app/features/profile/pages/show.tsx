import type { Song } from '@prisma/client';
import { Link, useLoaderData, useRouteLoaderData, useSearchParams, Form } from '@remix-run/react';

import { profileLayoutLoader, profileLoader } from 'app/features/profile/loader';
import styles from 'app/features/profile/pages/show.module.scss';

import MemoGridItem from '../components/MemoGridItem';
import { SortToggle } from '../components/SortToggle';

export default function Show() {
  const { user, userMusicMemo, isFollowing } = useLoaderData<typeof profileLoader>();
  const profileLayoutData = useRouteLoaderData<typeof profileLayoutLoader>('routes/profile.$userId');
  const currentUser = profileLayoutData?.user || null;

  const [searchParams] = useSearchParams();
  const currentSort = searchParams.get('sort') === 'asc' ? 'asc' : 'desc';

  const isCurrentUserProfile = !!currentUser && user.id === currentUser.id;

  return (
    <div>
      <TodaySongSection song={user.todayRecommendedSong} isCurrentUserProfile={isCurrentUserProfile} userId={user.id} />
      <div className={styles.profileBox}>
        <img className={styles.profileAvatar} src="/images/features/profile/profile_test.png" />
        <div className={styles.profileTextbox}>
          <div className={styles.infoTopRow}>
            <h2 className={styles.profileHandle}>{user.handle}</h2>
            {!isCurrentUserProfile && <FollowButton isFollowing={isFollowing} />}
          </div>
          <div className={styles.followStats}>
            <Link to="../follows?tab=followers" className={styles.statItem}>
              <span>팔로워</span>
              <div className={styles.follownum}>{user._count.followers}</div>
            </Link>
            <Link to="../follows?tab=following" className={styles.statItem}>
              <span>팔로잉</span>
              <div className={styles.follownum}>{user._count.following}</div>
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.contentBox}>
        <div className={styles.todayRecommendBox} style={{ marginTop: '2rem' }}>
          <div className={styles.titleBox}>
            <p className={styles.title}>HISTORY</p>
            <SortToggle currentSort={currentSort} />
          </div>
          <div className={styles.memoItemsBox}>
            {userMusicMemo.length > 0 ? (
              userMusicMemo.map((musicMemo) => (
                <Link key={musicMemo.song.id} to={`/music/${musicMemo.song.id}/user/${user.id}`}>
                  <MemoGridItem song={musicMemo.song} />
                </Link>
              ))
            ) : (
              <p className={styles.noContentText}>아직 작성한 메모가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TodaySongSectionProps {
  song: Partial<Song> | null;
  isCurrentUserProfile: boolean;
  userId: number;
}

export function TodaySongSection({ song, isCurrentUserProfile, userId }: TodaySongSectionProps) {
  if (!song || !song.title) {
    return (
      <div className={styles.todayRecommendBoxEmpty}>
        <p className={styles.noContentText}>오늘의 추천곡이 아직 없습니다.</p>
        {isCurrentUserProfile && (
          <Link className={styles.goToEditLink} to="../addTodaySong">
            수정하기
          </Link>
        )}
      </div>
    );
  }

  return (
    <div
      className={styles.todaySongBackground}
      style={{
        backgroundImage: `url(${song.thumbnailUrl || '/images/default-bg.jpg'})`,
      }}
    >
      <div className={styles.overlay}>
        <div className={styles.songInfo}>
          <h3 className={styles.songTitle}>{song.title}</h3>
          <p className={styles.songArtist}>{song.artist}</p>
        </div>
        {isCurrentUserProfile && (
          <Link className={styles.goToEditLink} to="../addTodaySong">
            편집
          </Link>
        )}
        <Link to={`/music/${song.id}/user/${userId}`} className={styles.songLink}></Link>
      </div>
    </div>
  );
}

interface FollowButtonProps {
  isFollowing: boolean;
}

export function FollowButton({ isFollowing }: FollowButtonProps) {
  return (
    <Form method="post">
      <button
        type="submit"
        name="_action"
        value={isFollowing ? 'unfollow' : 'follow'}
        className={`${styles.followBtn} ${isFollowing ? styles.unfollow : ''}`}
      >
        {isFollowing ? '언팔로우' : '팔로우'}
      </button>
    </Form>
  );
}
