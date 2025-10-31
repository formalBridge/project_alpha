import { redirect } from '@remix-run/server-runtime';

import { requireUserOwnership } from 'app/external/auth/jwt.server';
import createAction from 'app/utils/createAction';

import { publishFeedCreate } from './services';

export const createUserMusicMemoAction = createAction(async ({ db, request, params }) => {
  await requireUserOwnership(request, { userId: params.userId });
  const formdata = await request.formData();

  const songId = Number(formdata.get('songId'));
  const userId = Number(formdata.get('userId'));
  const content = formdata.get('content') as string;

  const memo = await db.userMusicMemo.create({
    data: {
      songId,
      userId,
      content,
    },
  });

  publishFeedCreate({ memoId: memo.id, authorId: memo.userId });

  return redirect('..');
});

export const editUserMusicMemoAction = createAction(async ({ db, request, params }) => {
  await requireUserOwnership(request, { userId: params.userId });

  const formdata = await request.formData();
  const id = Number(formdata.get('userMusicMemoId'));
  const content = formdata.get('content') as string;

  await db.userMusicMemo.update({
    where: { id },
    data: { content },
  });

  return redirect('..');
});
