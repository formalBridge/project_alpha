import { ReactNode } from 'react';
import MediaQuery, { useMediaQuery } from 'react-responsive';

export const useIsDesktop = () => useMediaQuery({ minWidth: 1024 });

export const useIsTablet = () => useMediaQuery({ minWidth: 768, maxWidth: 1023 });

export const useIsMobile = () => useMediaQuery({ maxWidth: 767 });

export const Desktop = ({ children }: { children: ReactNode }) => <MediaQuery minWidth={1024}>{children}</MediaQuery>;

export const Tablet = ({ children }: { children: ReactNode }) => (
  <MediaQuery minWidth={768} maxWidth={1023}>
    {children}
  </MediaQuery>
);

export const Mobile = ({ children }: { children: ReactNode }) => <MediaQuery maxWidth={767}>{children}</MediaQuery>;
