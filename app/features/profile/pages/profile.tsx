import { Outlet } from '@remix-run/react';

import { isMobile } from 'app/utils/responsive';

export default function Profile() {
  return (
    <div>
      {isMobile() ? <MobileLayout /> : <DesktopLayout />}
      <Outlet />
    </div>
  );
}

export const DesktopLayout = () => {
  return <div>DesktopLayout</div>;
};

export const MobileLayout = () => {
  return <div>MobileLayout</div>;
};
