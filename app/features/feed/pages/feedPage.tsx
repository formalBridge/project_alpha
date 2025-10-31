import { Link, useLoaderData } from '@remix-run/react';

import styles from './feedPage.module.scss';
import { feedLoader } from '../loader';

const DEFAULT_AVATAR = '/images/features/profile/profile_default.png';
const DEFAULT_COVER = '/images/features/profile/album_default2.png';

export default function feedPage() {
  const { feedList } = useLoaderData<typeof feedLoader>();

  return (
    <div className={styles.feed}>
      <ul className={styles.list}>
        {feedList.map((item) => (
          <li key={item.id} className={styles.card}>
            <Link to={`/music/${item.memo.userId}/user/${item.memoId}`} className={styles['cover-link']}>
              <div className={styles['cover-box']}>
                <img
                  className={styles.cover}
                  src={item.memo.song.thumbnailUrl || DEFAULT_COVER}
                  alt={`${item.memo.song.title} 앨범 커버`}
                />
              </div>
            </Link>
            <div className={styles.body}>
              <p className={styles.memo}>
                <Link to={`/music/${item.memo.userId}/user/${item.memoId}`} className={styles.memoLink}>
                  {trimFirstLine(item.memo.content)}
                </Link>
              </p>
              <div className={styles.meta}>
                <Link to={`/profile/${item.memo.userId}/show`} className={styles.chip}>
                  <img
                    className={styles.avatar}
                    src={(item.memo.user.avatarUrl ?? '').trim() || DEFAULT_AVATAR}
                    alt=""
                  />
                  <span className={styles.handle}>@{item.memo.user.handle}</span>
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function trimFirstLine(text: string) {
  if (!text) return '…';
  const firstLine = text.split(/\r?\n/)[0]?.trim();
  return firstLine && firstLine.length > 0 ? firstLine : '…';
}
