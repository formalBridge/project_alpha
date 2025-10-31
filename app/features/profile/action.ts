import { data, redirect } from '@remix-run/node';

import { getCurrentDBUser, requireUserOwnership } from 'app/external/auth/jwt.server';
import { MinioImageAPI } from 'app/external/image/MinioImageAPI';
import { updateUserHandle, followUser, unfollowUser, updateUserAvatar } from 'app/features/profile/services';
import createAction from 'app/utils/createAction';

import { HandleSchema, FollowsActionSchema } from './schema';

export const addTodaySongAction = createAction(async ({ request, db, params }) => {
  await requireUserOwnership(request, { userId: params.userId });
  const formData = await request.formData();

  const userId = Number(params.userId);
  if (isNaN(userId)) {
    return new Response(JSON.stringify('잘못된 사용자입니다.'), { status: 400 });
  }

  const title = (formData.get('title') as string | null)?.trim() ?? '';
  const artist = (formData.get('artist') as string | null)?.trim() ?? '';
  const album = (formData.get('album') as string | null)?.trim() || null;
  const thumbnailUrl = (formData.get('thumbnailUrl') as string | null)?.trim() || null;
  const spotifyId = (formData.get('spotifyId') as string | null)?.trim() || null;

  if (!title || !artist) {
    return new Response('제목과 아티스트는 필수입니다.', { status: 400 });
  }

  const existingSong =
    (spotifyId ? await db.song.findFirst({ where: { spotifyId } }) : null) ??
    (await db.song.findFirst({ where: { title, artist } }));

  const song = existingSong
    ? await db.song.update({
        where: { id: existingSong.id },
        data: { album, thumbnailUrl, spotifyId },
      })
    : await db.song.create({
        data: { title, artist, album, thumbnailUrl, spotifyId },
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
  const intent = formData.get('intent');

  if (intent === 'update-avatar') {
    const fileField = formData.get('avatar');

    if (!fileField || typeof fileField === 'string') {
      return data('파일이 없습니다.', { status: 400 });
    }

    const blob = fileField as Blob;
    const file = new File([blob], 'avatar.png', { type: blob.type || 'image/png' });

    const userId = Number(params.userId);
    const minio = new MinioImageAPI();

    const uploaded = await minio.upload({ userId, file, kind: 'avatar' });
    const publicUrl = minio.getPublicUrl(uploaded.key);

    await updateUserAvatar(db)({ userId, avatarUrl: publicUrl });

    return redirect(`/profile/${userId}/show`);
  }

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

export const showAction = createAction(async ({ request, db, params }) => {
  const currentUser = await getCurrentDBUser(request, db);
  if (!currentUser) {
    return redirect('/login/error', { status: 401 });
  }

  const formData = await request.formData();
  const intent = formData.get('intent');
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

export const followsAction = createAction(async ({ request, db }) => {
  const formData = await request.formData();
  const formPayload = Object.fromEntries(formData);

  const validatedData = FollowsActionSchema.safeParse(formPayload);
  if (!validatedData.success) {
    return data({ ok: false, error: validatedData.error.issues[0].message }, { status: 400 });
  }

  const { intent, targetUserId } = validatedData.data;

  const currentUser = await getCurrentDBUser(request, db);
  if (!currentUser) {
    return redirect('/login/error', { status: 401 });
  }

  try {
    if (intent === 'follow') {
      await followUser(db)({ followerId: currentUser.id, followingId: targetUserId });
    } else {
      await unfollowUser(db)({ followerId: currentUser.id, followingId: targetUserId });
    }
    return data({ ok: true });
  } catch (error) {
    return data({ ok: false, error: (error as Error).message }, { status: 400 });
  }
});

export const MemoLikeAction = createAction(async ({ request, db, params }) => {
  const currentUser = await getCurrentDBUser(request, db);
  if (!currentUser) {
    return data({ ok: false, error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const formData = await request.formData();
  const memoId = await db.userMusicMemo
    .findFirst({
      where: {
        userId: Number(params.userId),
        songId: Number(params.songId),
      },
    })
    .then((memo) => memo?.id);
  const intent = formData.get('intent');

  if (!intent || !memoId) {
    return data({ ok: false, error: '잘못된 요청입니다.' }, { status: 400 });
  }

  if (intent === 'like') {
    await db.memoLikesUser.upsert({
      where: {
        userId_memoId: {
          userId: currentUser.id,
          memoId: memoId,
        },
      },
      create: {
        userId: currentUser.id,
        memoId: memoId,
      },
      update: {},
    });
  } else if (intent === 'unlike') {
    await db.memoLikesUser.delete({
      where: {
        userId_memoId: {
          userId: currentUser.id,
          memoId: memoId,
        },
      },
    });
  }

  return data({ ok: true, like: intent === 'like' });
});
