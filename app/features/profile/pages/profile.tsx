import { Link, Outlet } from '@remix-run/react';

import { isMobile } from 'app/utils/responsive';

import styles from './profile.module.scss';

export default function Profile() {
  return isMobile() ? <MobileLayout /> : <DesktopLayout />;
}

export const DesktopLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export const MobileLayout = () => {
  return (
    <div className={styles.mobile}>
      <div className={styles.outlet}>
        <Outlet />
      </div>
      <nav className={styles.navigation}>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/search">Search</Link>
          </li>
          <li>
            <Link to="/profile/redirect">Profile</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
