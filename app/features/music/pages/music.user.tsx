import { useFetcher, useLoaderData } from '@remix-run/react';

import Editor from 'app/components/Editor';
import { MarkdownRenderer } from 'app/components/MarkdownRenderer';
import { ClientOnly } from 'remix-utils/client-only';

import { musicUserLoader } from '../loader';
import styles from './music.user.module.scss';

export default function MusicSongUserPage() {
  const fetcher = useFetcher<{ songId: number; userId: number; content: string }>({ key: 'create-memo' });
  const { song, user, UserMusicMemo, isCurrentUserProfile } = useLoaderData<typeof musicUserLoader>();

  if (!song || !user) {
    return <p>노래나 사용자를 찾을 수 없습니다.</p>;
  }

  const memo = fetcher.formData
    ? {
        date: new Date(),
        content: fetcher.formData.get('content') as string,
      }
    : UserMusicMemo
      ? {
          date: UserMusicMemo.updatedAt,
          content: UserMusicMemo.content || '',
        }
      : null;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageContainer}>
        <header className={styles.songHeader}>
          <img
            className={styles.albumCover}
            src={song.thumbnailUrl ?? '/images/features/profile/album_default2.png'}
            alt="앨범 커버"
          />
          <div className={styles.songDetails}>
            <h1 className={styles.songTitle}>{song?.title}</h1>
            <p className={styles.artistName}>{song?.artist}</p>
          </div>
        </header>

        <div className={styles.authorInfo}>
          <p className={styles.userName}>{user.name}</p>
          {memo?.date && <time dateTime="2023-03-15">{memo.date?.toDateString()}</time>}
        </div>

        {memo ? (
          <>
            <MarkdownRenderer content={memo.content} />
          </>
        ) : isCurrentUserProfile ? (
          <MemoEditor songId={song.id} userId={user.id} />
        ) : (
          <p className={styles.noMemoText}>메모가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

const MemoEditor = ({ songId, userId }: { songId: number; userId: number }) => {
  const fetcher = useFetcher<{ songId: number; userId: number; content: string }>({ key: 'create-memo' });

  return (
    <fetcher.Form method="post" className={styles.memoEditor}>
      <div className={styles.memoEditorTitleBox}>
        <h2>메모 작성하기</h2>
        <button type="submit" className={styles.submitButton}>
          저장
        </button>
      </div>
      <ClientOnly>{() => <Editor name="content" />}</ClientOnly>
      <input hidden name="songId" value={songId} readOnly />
      <input hidden name="userId" value={userId} readOnly />
    </fetcher.Form>
  );
};
