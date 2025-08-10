import { useLoaderData } from '@remix-run/react';

import { ClientOnly } from 'remix-utils/client-only';

import { MemoEditor } from '../components/memoEditor';
import { musicCreateUserLoader } from '../loader';

export default function MusicSongUserCreatePage() {
  const { song, user } = useLoaderData<typeof musicCreateUserLoader>();

  if (!song || !user) {
    return <p>에러가 발생했습니다. 관리자에게 문의하세요.</p>;
  }

  return (
    <ClientOnly>
      {() => (
        <MemoEditor type="create">
          <input type="hidden" name="songId" value={song.id} />
          <input type="hidden" name="userId" value={user.id} />
        </MemoEditor>
      )}
    </ClientOnly>
  );
}
