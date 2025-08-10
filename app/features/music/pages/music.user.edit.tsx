import { useLoaderData } from '@remix-run/react';

import { ClientOnly } from 'remix-utils/client-only';

import { MemoEditor } from '../components/memoEditor';
import { musicUserLoader } from '../loader';

export default function MusicSongUserCreatePage() {
  const { UserMusicMemo } = useLoaderData<typeof musicUserLoader>();

  if (!UserMusicMemo) {
    return <p>에러가 발생했습니다. 관리자에게 문의하세요.</p>;
  }

  return (
    <ClientOnly>
      {() => (
        <MemoEditor type="edit" initialContent={UserMusicMemo.content}>
          <input type="hidden" name="userMusicMemoId" value={UserMusicMemo.id} />
        </MemoEditor>
      )}
    </ClientOnly>
  );
}
