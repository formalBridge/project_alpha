import { json, redirect } from '@remix-run/node';
import { findUserByHandle } from 'app/features/profile/services';
import createAction from 'app/utils/createAction';

export const action = createAction(async ({ request, db, params }) => {
  const formData = await request.formData();

  const handle = (formData.get('handle') as string | null)?.trim() ?? '';

  if (handle) {
    const user = await findUserByHandle(db)({ handle });
    if (user) {
      return redirect(`/profile/${user.id}/show`);
    }
    return { error: `핸들 "${handle}"을 가진 사용자를 찾을 수 없습니다.` };
  }

  const userId = Number(params.userId);
  if (isNaN(userId)) {
    return json({ ok: false, error: '잘못된 사용자입니다.' }, { status: 400 });
  }

  const title        = (formData.get('title')        as string | null)?.trim() ?? '';
  const artist       = (formData.get('artist')       as string | null)?.trim() ?? '';
  const album        = (formData.get('album')        as string | null)?.trim() || null;
  const thumbnailUrl = (formData.get('thumbnailUrl') as string | null)?.trim() || null;

  if (!title || !artist) {
    return json({ ok: false, error: '제목과 아티스트는 필수입니다.' }, { status: 400 });
  }

  const song = await db.song.upsert({
    where:  { title_artist: { title, artist } },
    create: { title, artist, album, thumbnailUrl },
    update: {},
  });

  await db.user.update({
    where: { id: userId },
    data:  { todayRecommendedSongId: song.id },
  });

  return redirect('../show');
});
