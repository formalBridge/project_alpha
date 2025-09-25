import { data, redirect } from '@remix-run/node';

import { getCurrentDBUser, requireUserOwnership } from 'app/external/auth/jwt.server';
import { findUserByHandle, updateUserHandle, followUser, unfollowUser } from 'app/features/profile/services';
import createAction from 'app/utils/createAction';

import { HandleSchema } from './schema';

export const addTodaySongAction = createAction(async ({ request, db, params }) => {
  await requireUserOwnership(request, { userId: params.userId });
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

export const editHandleAction = createAction(async ({ request, db, params }) => {
  await requireUserOwnership(request, { userId: params.userId });

  const formData = await request.formData();

  const formPayload = {
    userId: formData.get('userId'),
    handle: formData.get('handle'),
  };

  const result = HandleSchema.safeParse(formPayload);

  if (!result.success) {
    return data({ error: result.error.issues[0].message }, { status: 400 });
  }

  try {
    await updateUserHandle(db)({ userId: result.data.userId, handle: result.data.handle });
    return redirect(`/profile/${result.data.userId}/show`);
  } catch (err) {
    return data({ error: (err as Error).message }, { status: 400 });
  }
});

export const settingsAction = createAction(async ({ request, db, params }) => {
  await requireUserOwnership(request, { userId: params.userId });

  const formData = await request.formData();

  const formPayload = {
    userId: formData.get('userId'),
    handle: formData.get('handle'),
  };

  const result = HandleSchema.safeParse(formPayload);

  if (!result.success) {
    return data({ error: result.error.issues[0].message }, { status: 400 });
  }

  try {
    await updateUserHandle(db)({ userId: result.data.userId, handle: result.data.handle });
    return redirect(`/profile/${result.data.userId}/show`);
  } catch (err) {
    return data({ error: (err as Error).message }, { status: 400 });
  }
});

export const followAction = createAction(async ({ request, db, params }) => {
  const currentUser = await getCurrentDBUser(request, db);
  if (!currentUser) {
    return redirect('/login/error', { status: 401 });
  }

  const formData = await request.formData();
  const intent = formData.get('_action');
  const profileUserId = Number(params.userId);

  if (intent === 'follow') {
    await followUser(db)({ followerId: currentUser.id, followingId: profileUserId });
  } else if (intent === 'unfollow') {
    await unfollowUser(db)({ followerId: currentUser.id, followingId: profileUserId });
  } else {
    throw new Response('잘못된 요청입니다.', { status: 400 });
  }

  return null;
});
