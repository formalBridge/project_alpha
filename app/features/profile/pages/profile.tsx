import { Link, Outlet } from '@remix-run/react';
import { useEffect, useState } from 'react';

import Logo from 'app/icon/logo';
import { useIsMobile } from 'app/utils/responsive';

import styles from './profile.module.scss';

export default function Profile() {
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? isMobile ? <MobileLayout /> : <DesktopLayout /> : null;
}

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
            <Link to="/profile/search">Search</Link>
          </li>
          <li>
            <Link to="/profile/redirect">Profile</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export const DesktopLayout = () => {
  return (
    <div className={styles.desktop}>
      <nav className={styles.navigation}>
        <Link to="/" className={styles.logo}>
          <Logo className={styles.logoIcon} />
          <span>두둠 음악</span>
        </Link>
        <ul className={styles.list}>
          <li>
            <Link to="/profile/search">Search</Link>
          </li>
          <li>
            <Link to="/profile/redirect">Profile</Link>
          </li>
        </ul>
      </nav>
      <div className={styles.outletWrapper}>
        <div className={styles.outlet}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
