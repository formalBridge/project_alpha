import { redirect } from '@remix-run/node';

import { findUserByHandle } from 'app/features/profile/services';
import createAction from 'app/utils/createAction';

export const action = createAction(async ({ request, db }) => {
  const formData = await request.formData();
  const handle = formData.get('handle');

  if (typeof handle !== 'string' || handle.trim() === '') {
    return { error: '핸들을 입력해주세요.' };
  }

  const user = await findUserByHandle(db)({ handle: handle });

  if (user) {
    return redirect(`/profile/${user.id}/show`);
  } else {
    return { error: `핸들 "${handle}"을 가진 사용자를 찾을 수 없습니다.` };
  }
});
