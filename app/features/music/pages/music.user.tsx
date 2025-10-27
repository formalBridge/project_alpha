import { Link, Outlet, useFetcher, useLoaderData } from '@remix-run/react';
import dayjs from 'dayjs';
import { useMemo } from 'react';

import { musicUserLoader } from '../loader';
import styles from './music.user.module.scss';

export default function MusicSongUserPage() {
  const { song, user, UserMusicMemo, isCurrentUserProfile, spotifyEmbed, isMemoLiked } =
    useLoaderData<typeof musicUserLoader>();

  if (!song || !user) {
    return <p>노래나 사용자를 찾을 수 없습니다.</p>;
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageContainer}>
        <div className={styles.toProfileLinkBox}>
          <Link className={styles.toProfileLink} to={`/profile/${user.id}/show`}>
            ＜ 프로필로 이동
          </Link>
        </div>
        <MemoHeader key={UserMusicMemo?.id} song={song} spotifyEmbed={spotifyEmbed} UserMusicMemo={UserMusicMemo} />
        <div className={styles.authorInfo}>
          <p className={styles.userHandle}>{user.handle}</p>
          {UserMusicMemo && UserMusicMemo.updatedAt && (
            <time dateTime={UserMusicMemo.updatedAt.toISOString()}>
              {dayjs(UserMusicMemo.updatedAt).format('YYYY-MM-DD')}
            </time>
          )}
          {UserMusicMemo && (
            <LikeButton likes={UserMusicMemo.likes} memoId={UserMusicMemo.id} isChecked={isMemoLiked} />
          )}
          {isCurrentUserProfile && (
            <Link className={styles.goToEditLink} to="edit">
              수정하기
            </Link>
          )}
        </div>

        <Outlet />
      </div>
    </div>
  );
}

type MemoHeaderProps = Pick<Awaited<ReturnType<typeof musicUserLoader>>, 'UserMusicMemo' | 'spotifyEmbed' | 'song'>;

const MemoHeader = ({ spotifyEmbed, UserMusicMemo, song }: MemoHeaderProps) => {
  return spotifyEmbed ? (
    <div key={UserMusicMemo?.id} className={styles.spotifyPlayerContainer}>
      <div className={styles.spotifyPlayer} dangerouslySetInnerHTML={{ __html: spotifyEmbed.html }} />
    </div>
  ) : (
    <header className={styles.songHeader}>
      <img
        className={styles.albumCover}
        src={song?.thumbnailUrl ?? '/images/features/profile/album_default2.png'}
        alt="앨범 커버"
      />
      <div className={styles.songDetails}>
        <h1 className={styles.songTitle}>{song?.title}</h1>
        <p className={styles.artistName}>{song?.artist}</p>
      </div>
    </header>
  );
};

const LikeButton = ({likes, memoId: _memoId, isChecked: isMemoLiked }: { likes: number; memoId: number; isChecked: boolean; }) => {
  const fetcher = useFetcher();
  const submitting = fetcher.state !== 'idle';
  const intentInFlight = fetcher.formData?.get('intent') as 'like' | 'unlike' | undefined;

  const optimisticLiked = useMemo(() => {
    if (!intentInFlight) return isMemoLiked;
    return intentInFlight === 'like';
  }, [intentInFlight, isMemoLiked]);

  const optimisticLikes = useMemo(() => {
    if (!intentInFlight) return likes;
    return intentInFlight === 'like' ? likes + 1 : likes - 1;
  }, [intentInFlight, likes]);

  const nextIntent = optimisticLiked ? 'unlike' : 'like';

  return (
    <fetcher.Form method="post" className={styles.likeForm}>
      <button
        type="submit"
        name="intent"
        value={nextIntent}
        className={[styles.likeButton, optimisticLiked ? styles.liked : '', submitting ? styles.loading : ''].join(' ')}
        aria-pressed={optimisticLiked}
        aria-label={optimisticLiked ? '좋아요 취소' : '좋아요'}
        disabled={submitting}
      >
        <svg
          className={styles.heart}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.8 4.6c-1.7-1.7-4.4-1.7-6.1 0L12 7.3l-2.7-2.7c-1.7-1.7-4.4-1.7-6.1 0s-1.7 4.4 0 6.1l8.8 8.8 8.8-8.8c1.7-1.7 1.7-4.4 0-6.1z" />
        </svg>

        <span className={styles.likeCount} aria-live="polite">
          {optimisticLikes}
        </span>
      </button>
    </fetcher.Form>
  );
};
