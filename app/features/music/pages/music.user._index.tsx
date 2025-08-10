import { Link, useLoaderData } from '@remix-run/react/dist/components';

import { MarkdownRenderer } from 'app/components/MarkdownRenderer';
import { ClientOnly } from 'remix-utils/client-only';

import { musicUserLoader } from '../loader';

export default function MusicSongUserIndexPage() {
  const { UserMusicMemo, isCurrentUserProfile } = useLoaderData<typeof musicUserLoader>();

  return UserMusicMemo ? (
    <ClientOnly>{() => <MarkdownRenderer content={UserMusicMemo?.content} />}</ClientOnly>
  ) : (
    <>
      <p>메모가 없습니다.</p>
      {isCurrentUserProfile && (
        <Link to="create" className="button">
          메모 작성하기
        </Link>
      )}
    </>
  );
}
