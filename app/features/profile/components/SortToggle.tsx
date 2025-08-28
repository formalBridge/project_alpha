import { Link } from '@remix-run/react';

import styles from './SortToggle.module.scss';

interface SortToggleProps {
  currentSort: 'asc' | 'desc';
}

export function SortToggle({ currentSort }: SortToggleProps) {
  return (
    <div className={styles.container}>
      <Link to="?sort=desc" className={currentSort === 'desc' ? styles.active : ''} preventScrollReset>
        최신순
      </Link>
      <Link to="?sort=asc" className={currentSort === 'asc' ? styles.active : ''} preventScrollReset>
        오래된순
      </Link>
    </div>
  );
}
