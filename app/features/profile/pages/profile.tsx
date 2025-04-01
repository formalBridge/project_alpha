import { Outlet, useLoaderData } from '@remix-run/react';

import { profileLoader } from '../loader';
import styles from './profile.module.scss';

export default function Profile() {
  const { user } = useLoaderData<typeof profileLoader>();

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
        <Outlet />
      </div>
    </div>
  );
}
