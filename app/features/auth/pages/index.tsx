import { useLoaderData, Link } from '@remix-run/react';

import styles from './index.module.scss';

interface LoaderData {
  error?: string | null;
}

export function LoginPage() {
  const { error } = useLoaderData<LoaderData>();

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>로그인</h1>

      {error === 'auth_failed' && (
        <p className={styles.errorMessage}>⚠️ Google 로그인에 실패했습니다. 다시 시도해주세요.</p>
      )}

      <Link to="/profile/redirect" className={styles.retryButton}>
        구글 로그인 다시 시도
      </Link>
    </main>
  );
}
