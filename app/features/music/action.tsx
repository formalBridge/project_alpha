import { redirect } from '@remix-run/server-runtime';

import createAction from 'app/utils/createAction';

export const createUserMusicMemoAction = createAction(async ({ db, request }) => {
  console.log('1231241243');
  const formdata = await request.formData();

  const songId = Number(formdata.get('songId'));
  const userId = Number(formdata.get('userId'));
  const content = formdata.get('content') as string;

  await db.userMusicMemo.create({
    data: {
      songId,
      userId,
      content,
    },
  });

  return redirect('..');
});

export const editUserMusicMemoAction = createAction(async ({ db, request }) => {
  const formdata = await request.formData();
  const id = Number(formdata.get('userMusicMemoId'));
  const content = formdata.get('content') as string;

  await db.userMusicMemo.update({
    where: { id },
    data: { content },
  });

  return redirect('..');
});
