import { useLoaderData } from '@remix-run/react';

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
            {/* 앨범 커버 */}
            <a className={styles['cover-link']} href="#" onClick={(e) => e.preventDefault()}>
              <div className={styles['cover-box']}>
                <img
                  className={styles.cover}
                  src={item.memo.song.thumbnailUrl || DEFAULT_COVER}
                  alt={`${item.memo.song.title} 앨범 커버`}
                />
              </div>
            </a>

            {/* 본문 */}
            <div className={styles.body}>
              {/* 메모 첫 줄 */}
              <p className={styles.memo}>{trimFirstLine(item.memo.content)}</p>

              <div className={styles.meta}>
                <a className={styles.chip} href="#" onClick={(e) => e.preventDefault()}>
                  <img
                    className={styles.avatar}
                    src={(item.memo.user.avatarUrl ?? '').trim() || DEFAULT_AVATAR}
                    alt=""
                  />
                  <span className={styles.handle}>@{item.memo.user.handle}</span>
                </a>
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
