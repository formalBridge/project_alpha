import { User } from '@prisma/client';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';

import { useIsMobile } from 'app/utils/responsive';

import styles from './profile.module.scss';
import { profileLayoutLoader } from '../loader';

export default function ProfilePage() {
  const { user } = useLoaderData<typeof profileLayoutLoader>() || {};

  const isMobile = useIsMobile();
  return isMobile ? <MobileLayout /> : <DesktopLayout user={user} />;
}

export const MobileLayout = () => (
  <div className={styles.mobile}>
    <div className={styles.outlet}>
      <Outlet />
    </div>
    <nav className={styles.navigation}>
      <ul className={styles.list}>
        <li>
          <a href="/" className={styles.item}>
            <img src="/images/features/profile/home.png" alt="" className={styles.icon} />
            <span>홈</span>
          </a>
        </li>
        <li>
          <NavItem href="show" label="기록하기" iconSrc="/images/features/profile/editing.png" />
        </li>
        <li>
          <NavItem href="search" label="검색" iconSrc="/images/features/profile/search_icon.png" />
        </li>
        <li>
          <NavItem href="settings" label="설정" iconSrc="/images/features/profile/settings.png" />
        </li>
      </ul>
    </nav>
  </div>
);

export const DesktopLayout = ({ user }: { user: User | null }) => (
  <div className={styles.desktop}>
    <nav className={styles.navigation}>
      <a href="/" className={styles.logo}>
        <span>두둠 음악</span>
        <Link to="/logout">로그아웃</Link>
      </a>

      <UserNavCard user={user} />

      <ul className={styles.list}>
        <li>
          <NavItem href="search" label="검색" iconSrc="/images/features/profile/search_icon.png" />
        </li>
        <li>
          <NavItem
            href={user ? `/profile/${user.id}/show` : '/profile/redirect'}
            label="기록하기"
            iconSrc="/images/features/profile/editing.png"
          />
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

function useCurrentPath() {
  const [path, setPath] = useState<string>('');
  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    update();
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);
  return path;
}

function UserNavCard({ user }: { user: User | null }) {
  const path = useCurrentPath();
  const isActive = /\/settings($|\/)/.test(path);

  const sub = (user?.handle ? `@${user.handle}` : user?.email) ?? '계정 설정';
  const avatar = '/images/features/profile/profile_default.png';

  return (
    <Link
      to={user ? `/profile/${user.id}/settings` : '/profile/redirect'}
      className={`${styles.userCard} ${isActive ? styles.active : ''}`}
    >
      <img src={avatar} alt="" className={styles.userAvatar} />
      <div className={styles.userMeta}>
        <div className={styles.userEmail}>{sub}</div>
      </div>
    </Link>
  );
}

function NavItem({
  href,
  label,
  iconSrc,
  activeIconSrc,
  iconAlt = '',
}: {
  href: string;
  label: string;
  iconSrc: string;
  activeIconSrc?: string;
  iconAlt?: string;
}) {
  const path = useCurrentPath();
  const seg = href.replace(/^\/+/, '');
  const isActive = new RegExp(`/${seg}($|/)`).test(path);
  const currentIcon = isActive && activeIconSrc ? activeIconSrc : iconSrc;

  return (
    <Link to={href} className={`${styles.item} ${isActive ? styles.active : ''}`}>
      <img src={currentIcon} alt={iconAlt} className={styles.icon} />
      <span>{label}</span>
    </Link>
  );
}
