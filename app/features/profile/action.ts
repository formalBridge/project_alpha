import { data, redirect } from '@remix-run/node';

import { findUserByHandle, updateUserHandle } from 'app/features/profile/services';
import createAction from 'app/utils/createAction';

export const addTodaySongAction = createAction(async ({ request, db, params }) => {
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
    return new Response(JSON.stringify('잘못된 사용자입니다.'), { status: 400 });
  }

  const title = (formData.get('title') as string | null)?.trim() ?? '';
  const artist = (formData.get('artist') as string | null)?.trim() ?? '';
  const album = (formData.get('album') as string | null)?.trim() || null;
  const thumbnailUrl = (formData.get('thumbnailUrl') as string | null)?.trim() || null;

  if (!title || !artist) {
    return new Response('제목과 아티스트는 필수입니다.', { status: 400 });
  }

  const song = await db.song.upsert({
    where: { title_artist: { title, artist } },
    create: { title, artist, album, thumbnailUrl },
    update: {},
  });

  await db.user.update({
    where: { id: userId },
    data: { todayRecommendedSongId: song.id },
  });

  return redirect('../show');
});

export const editHandleAction = createAction(async ({ request, db }) => {
  const formData = await request.formData();
  const handle = formData.get('handle')?.toString();
  const userId = formData.get('userId')?.toString();

  if (!userId) {
    return redirect('/login?error=사용자 정보를 불러올 수 없습니다.');
  }

  if (typeof handle !== 'string' || handle.trim().length === 0) {
    return data({ error: '핸들을 입력해주세요.' }, { status: 400 });
  }

  try {
    await updateUserHandle(db)({ userId, handle });
    return redirect(`/profile/${userId}/show`);
  } catch (err) {
    return data({ error: (err as Error).message }, { status: 400 });
  }
});
