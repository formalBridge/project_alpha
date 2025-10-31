import { User } from '@prisma/client';
import { Link, NavLink, Outlet, useLoaderData } from '@remix-run/react';

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
    <nav className={styles.navigationMobile}>
      <ul className={styles.list}>
        <li>
          <Link to="/" className={styles.item}>
            <img src="/images/features/profile/home.png" alt="" className={styles.icon} />
            <span>홈</span>
          </Link>
        </li>
        <li>
          <NavItem href="feed" label="피드" iconSrc="/images/features/profile/feed.png" />
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
      <Link to="/" className={styles.logo}>
        <span>Sonnets</span>
      </Link>

      <UserNavCard user={user} />

      <ul className={styles.list}>
        <li>
          <NavItem href="feed" label="피드" iconSrc="/images/features/profile/feed.png" />
        </li>
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
        <li>
          <NavItem
            href={user ? `/profile/${user.id}/settings` : '/profile/redirect'}
            label="설정"
            iconSrc="/images/features/profile/settings.png"
            iconAlt="설정"
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

function UserNavCard({ user }: { user: User | null }) {
  const to = user ? `/profile/${user.id}/settings` : '/profile/redirect';
  const sub = (user?.handle ? `@${user.handle}` : user?.email) ?? '계정 설정';
  const avatar =
    user?.avatarUrl && user.avatarUrl.trim() !== '' ? user.avatarUrl : '/images/features/profile/profile_default.png';

  return (
    <NavLink to={to} className={({ isActive }) => `${styles.userCard} ${isActive ? styles.active : ''}`}>
      <img src={avatar} alt="" className={styles.userAvatar} />
      <div className={styles.userMeta}>
        <div className={styles.userEmail}>{sub}</div>
      </div>
    </NavLink>
  );
}

function NavItem({
  href,
  label,
  iconSrc,
  activeIconSrc,
  iconAlt = '',
  end,
}: {
  href: string;
  label: string;
  iconSrc: string;
  activeIconSrc?: string;
  iconAlt?: string;
  end?: boolean;
}) {
  return (
    <NavLink to={href} end={end} className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}>
      {({ isActive }) => (
        <>
          <img src={isActive && activeIconSrc ? activeIconSrc : iconSrc} alt={iconAlt} className={styles.icon} />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}
