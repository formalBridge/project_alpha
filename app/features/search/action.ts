import { redirect } from '@remix-run/node';

import { getCurrentUser } from 'app/external/auth/jwt.server';
import createAction from 'app/utils/createAction';

export const searchAction = createAction(async ({ request, db }) => {
  const formData = await request.formData();
  const actionType = String(formData.get('_action') ?? '');

  const currentUser = await getCurrentUser(request);
  if (!currentUser) {
    return redirect('/login/error');
  }
  const userId = currentUser.id;
  if (Number.isNaN(userId)) {
    return new Response('잘못된 사용자입니다.', { status: 400 });
  }

  const songId = formData.get('songId');
  const title = (formData.get('title') as string | null)?.trim() ?? '';
  const artist = (formData.get('artist') as string | null)?.trim() ?? '';
  const album = (formData.get('album') as string | null)?.trim() || null;
  const thumbnailUrl = (formData.get('thumbnailUrl') as string | null)?.trim() || null;
  const spotifyId = (formData.get('spotifyId') as string | null)?.trim() || null;

  const maybeSongOrResponse = await (async () => {
    if (songId) {
      const s = await db.song.findUnique({ where: { id: Number(songId) } });
      if (!s) return new Response('노래를 찾을 수 없습니다.', { status: 404 });
      return s;
    }

    if (!title || !artist) {
      return new Response('제목과 아티스트는 필수입니다.', { status: 400 });
    }

    const existingSong =
      (spotifyId ? await db.song.findFirst({ where: { spotifyId } }) : null) ??
      (await db.song.findFirst({ where: { title, artist } }));

    if (existingSong) {
      const updated = await db.song.update({
        where: { id: existingSong.id },
        data: { album, thumbnailUrl, spotifyId },
      });
      return updated;
    }

    const created = await db.song.create({
      data: { title, artist, album, thumbnailUrl, spotifyId },
    });
    return created;
  })();

  if (maybeSongOrResponse instanceof Response) {
    return maybeSongOrResponse;
  }

  const song = maybeSongOrResponse;

  if (actionType === 'addToday') {
    await db.user.update({
      where: { id: userId },
      data: { todayRecommendedSongId: song.id },
    });
    return redirect(`/profile/${userId}/show`);
  }

  if (actionType === 'createMemo') {
    return redirect(`/music/${song.id}/user/${userId}/create`);
  }

  return new Response('unknown action', { status: 400 });
});
