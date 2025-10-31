import { Link } from '@remix-run/react';

import type { UserMusicMemoWithRelations } from 'app/features/search/services';

import styles from './MemoItem.module.scss';

const DEFAULT_AVATAR = '/images/features/profile/profile_default.png';
const DEFAULT_COVER = '/images/features/profile/album_default2.png';

export default function MemoItem({ memo }: { memo: UserMusicMemoWithRelations }) {
  const cover = memo.song?.thumbnailUrl ?? DEFAULT_COVER;
  const avatar = memo.user?.avatarUrl ?? DEFAULT_AVATAR;
  const excerpt = memo.content.length > 120 ? `${memo.content.slice(0, 120)}…` : memo.content;
  const createdISO = new Date(memo.createdAt).toISOString();
  const created = new Date(memo.createdAt).toLocaleString();

  return (
    <Link to={`/music/${memo.songId}/user/${memo.user.id}`} className={styles.memoLink} aria-label="메모 보기">
      <article className={styles.memoItem}>
        <header className={styles.media}>
          <img src={cover} alt={memo.song?.title ?? '앨범 커버'} className={styles.cover} />
          <div className={styles.overlay}>
            <div className={styles.userRow}>
              <img className={styles.avatar} src={avatar} alt={memo.user?.handle ?? 'user'} />
              <div className={styles.userInfo}>
                <span className={styles.handle}>@{memo.user?.handle}</span>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.body}>
          <div className={styles.songMeta}>
            <div className={styles.titleBlock}>
              <div className={styles.songTitle}>{memo.song?.title ?? '제목 없음'}</div>
              <div className={styles.artist}>{memo.song?.artist}</div>
            </div>
            <div className={styles.timeInBody}>
              <time dateTime={createdISO}>{created}</time>
            </div>
          </div>

          {excerpt ? <p className={styles.content}>{excerpt}</p> : null}
        </div>
      </article>
    </Link>
  );
}
