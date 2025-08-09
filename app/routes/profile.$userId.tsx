import { Outlet, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';

import { profileLoader } from 'app/features/profile/loader';
import styles from 'app/features/profile/pages/profile.module.scss';
import Logo from 'app/icon/logo';
import { useIsMobile } from 'app/utils/responsive';

export { profileLoader as loader } from 'app/features/profile/loader';

interface User {
  id: number | string | null;
  name: string | null;
  nickname: string | null;
  handle: string | null;
  email: string | null;
  avatarUrl: string | null;
}

interface ItemProps {
  href: string;
  label: string;
  iconSrc: string;
  activeIconSrc?: string;
  iconAlt?: string;
}

export const MobileLayout = ({ user: _user }: { user: Partial<User> | null }) => (
  <div className={styles.mobile}>
    <div className={styles.outlet}>
      <Outlet />
    </div>
    <nav className={styles.navigation}>
      <ul className={styles.list}>
        <li>
          <a href="/" className={styles.item}>
            <img src="/images/features/profile/home.png" alt="" className={styles.icon} />
            <span>마이페이지</span>
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

export const DesktopLayout = ({ user }: { user: Partial<User> | null }) => (
  <div className={styles.desktop}>
    <nav className={styles.navigation}>
      <a href="/" className={styles.logo}>
        <Logo className={styles.logoIcon} />
        <span>두둠 음악</span>
      </a>

      <UserNavCard user={user} />

      <ul className={styles.list}>
        <li>
          <NavItem href="search" label="검색" iconSrc="/images/features/profile/search_icon.png" />
        </li>
        <li>
          <NavItem href="show" label="기록하기" iconSrc="/images/features/profile/editing.png" />
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

function UserNavCard({ user }: { user: Partial<User> | null }) {
  const path = useCurrentPath();
  const isActive = /\/settings($|\/)/.test(path);

  const displayName = user?.name ?? user?.nickname ?? '게스트';
  const sub = (user?.handle ? `@${user.handle}` : user?.email) ?? '계정 설정';
  const avatar = user?.avatarUrl || '/images/features/profile/profile_test.png';

  return (
    <a href="settings" className={`${styles.userCard} ${isActive ? styles.active : ''}`}>
      <img src={avatar} alt="" className={styles.userAvatar} />
      <div className={styles.userMeta}>
        <div className={styles.userName}>{displayName}</div>
        <div className={styles.userEmail}>{sub}</div>
      </div>
    </a>
  );
}

function NavItem({ href, label, iconSrc, activeIconSrc, iconAlt = '' }: ItemProps) {
  const path = useCurrentPath();
  const seg = href.replace(/^\/+/, '');
  const isActive = new RegExp(`/${seg}($|/)`).test(path);
  const currentIcon = isActive && activeIconSrc ? activeIconSrc : iconSrc;

  return (
    <a href={href} className={`${styles.item} ${isActive ? styles.active : ''}`}>
      <img src={currentIcon} alt={iconAlt} className={styles.icon} />
      <span>{label}</span>
    </a>
  );
}

export default function ProfileLayout() {
  const data = useLoaderData<typeof profileLoader>() || {};
  const user: Partial<User> | null = data.user ?? null;

  const isMobile = useIsMobile();
  return isMobile ? <MobileLayout user={user} /> : <DesktopLayout user={user} />;
}
