import { ReactNode } from 'react';
import { useMediaQuery } from 'react-responsive';

export const isDesktop = () => useMediaQuery({ minWidth: 1024 });

export const isTablet = () => useMediaQuery({ minWidth: 768, maxWidth: 1023 });

export const isMobile = () => useMediaQuery({ maxWidth: 767 });

export const Desktop = ({ children }: { children: ReactNode }) => {
  return isDesktop() ? children : null;
};

export const Tablet = ({ children }: { children: ReactNode }) => {
  return isTablet() ? children : null;
};

export const Mobile = ({ children }: { children: ReactNode }) => {
  return isMobile() ? children : null;
};
