import { Link } from '@remix-run/react';

import styles from './index.module.scss';

export default function Home() {
  return (
    <div>
      <div className={styles.mainContainer}>
        <h1 className={styles.mainText}>
          <p>스쳐가는 생각들, 머무는 감정들.</p>
          <p>
            내가 <strong>좋아하는 음악</strong>을 쉽게 기록해보세요.
          </p>
        </h1>
        <div>
          <Link to="/profile/redirect">
            <button className={styles.startButton}>지금 시작하기</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
