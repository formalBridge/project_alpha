import createAction from 'app/utils/createAction';

export const createUserMusicMemoAction = createAction(async ({ db, request }) => {
  console.log('1231241243');
  const formdata = await request.formData();

  const songId = Number(formdata.get('songId'));
  const userId = Number(formdata.get('userId'));
  const content = formdata.get('content') as string;

  console.log({ songId, userId, content });

  const memo = await db.userMusicMemo.create({
    data: {
      songId,
      userId,
      content,
    },
  });

  return memo;
});
