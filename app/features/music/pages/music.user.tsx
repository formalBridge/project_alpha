import { Link, Outlet, useLoaderData } from '@remix-run/react';

import { musicUserLoader } from '../loader';
import styles from './music.user.module.scss';

export default function MusicSongUserPage() {
  const { song, user, UserMusicMemo, isCurrentUserProfile } = useLoaderData<typeof musicUserLoader>();

  if (!song || !user) {
    return <p>노래나 사용자를 찾을 수 없습니다.</p>;
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageContainer}>
        <header className={styles.songHeader}>
          <img
            className={styles.albumCover}
            src={song.thumbnailUrl ?? '/images/features/profile/album_default2.png'}
            alt="앨범 커버"
          />
          <div className={styles.songDetails}>
            <h1 className={styles.songTitle}>{song?.title}</h1>
            <p className={styles.artistName}>{song?.artist}</p>
          </div>
        </header>

        <div className={styles.authorInfo}>
          <p className={styles.userName}>{user.name}</p>
          {UserMusicMemo && UserMusicMemo.updatedAt && (
            <time dateTime="2023-03-15">{UserMusicMemo.updatedAt.toISOString()}</time>
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
