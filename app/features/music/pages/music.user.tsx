import { Link, Outlet, useLoaderData } from '@remix-run/react';
import dayjs from 'dayjs';

import { musicUserLoader } from '../loader';
import styles from './music.user.module.scss';
import LikeButton from '../components/likeButton';

export default function MusicSongUserPage() {
  const { song, user, UserMusicMemo, isCurrentUserProfile, spotifyEmbed } = useLoaderData<typeof musicUserLoader>();

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
        {spotifyEmbed ? (
          <div className={styles.spotifyPlayerContainer}>
            <div className={styles.spotifyPlayer} dangerouslySetInnerHTML={{ __html: spotifyEmbed.html }} />
          </div>
        ) : (
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
        )}

        <div className={styles.authorInfo}>
          <p className={styles.userHandle}>{user.handle}</p>
          {UserMusicMemo && UserMusicMemo.updatedAt && (
            <time dateTime={UserMusicMemo.updatedAt.toISOString()}>
              {dayjs(UserMusicMemo.updatedAt).format('YYYY-MM-DD')}
            </time>
          )}
          {UserMusicMemo && <LikeButton likes={UserMusicMemo.likes} />}
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
