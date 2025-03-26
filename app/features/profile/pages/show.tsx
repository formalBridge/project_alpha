import { useLoaderData } from '@remix-run/react';

import { showLoader } from '../loader';
import styles from './show.module.scss';

export default function Show() {
  const { user } = useLoaderData<typeof showLoader>();

  const currentUser = user ?? { id: 0, name: 'Guest' };

  return (
    <div>
      <div className={styles.profileBox}>
        <img className={styles.profileAvatar} src="/images/features/profile/profile_test.png" />
        <div className={styles.profileTextbox}>
          <p className={styles.profileName}>{currentUser.name}</p>
          <p className={styles.profileHandle}>@han_dle</p>
        </div>
      </div>
      <div className={styles.contentBox}>
        <div className={styles.todayRecommendBox}>
          <p className={styles.title}>👍 오늘의 추천곡</p>
          <div className={styles.songBox}>
            <SongItem />
          </div>
        </div>
        <div className={styles.todayRecommendBox}>
          <p className={styles.title}>👑 노래 랭킹</p>
          <div className={styles.songBox}>
            <SongItem />
            <SongItem />
            <SongItem />
            <SongItem />
          </div>
        </div>
      </div>
    </div>
  );
}

const SongItem = () => {
  return (
    <div className={styles.songItem}>
      <img className={styles.itemImage} />
      <div className={styles.itemTextBox}>
        <p className={styles.itemTitle}>노래 제목</p>
        <p className={styles.itemArtist}>가수 이름</p>
      </div>
    </div>
  );
};
