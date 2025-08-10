import { useLoaderData } from '@remix-run/react';

import { musicUserLoader } from '../loader';
import styles from './music.user.module.scss';

export default function MusicSongUserPage() {
  const { song, user } = useLoaderData<typeof musicUserLoader>();

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
          <time dateTime="2023-03-15">2023년 3월 15일</time>
        </div>

        <article className={styles.content}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sit amet faucibus dolor. In id velit quis
            turpis dapibus rhoncus. Quisque quam est, commodo id tortor sed, porttitor ultricies leo. Vestibulum
            dignissim, sapien id imperdiet imperdiet, erat nulla efficitur nisl, non suscipit ipsum velit ut orci.
          </p>
          <p>
            Sed gravida justo tempus, fermentum dui eu, auctor erat. Quisque vitae turpis tortor. Ut rhoncus mauris
            lacus. Nulla euismod mollis condimentum. Integer sodales dignissim lacus, eu gravida enim cursus a. Duis
            congue porta arcu, sed pretium ipsum placerat non.
          </p>
        </article>
      </div>
    </div>
  );
}
