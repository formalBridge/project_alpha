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
      <div>
        <div>
          <p>오늘의 추천곡</p>
          <div>
            <img></img>
            <div>
              <p>노래 제목</p>
              <p>가수 이름</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
