import type { MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';

import Home from 'app/features/home';
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
    return { error: '핸들 "${handle}"을 가진 사용자를 찾을 수 없습니다.' };
  }
});

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export default function Index() {
  const actionData = useActionData<typeof action>();
  const errorMessage = actionData?.error || null;

  return (
    <div>
      <div>
        <h3>사용자 프로필 검색</h3>
        <Form method="post" role="search">
          <input
            type="search"
            name="handle"
            placeholder="사용자 핸들을 입력하세요 (예: idk)"
            aria-label="사용자 핸들 검색"
          />
          <button type="submit">프로필 검색</button>
        </Form>

        {errorMessage && <p>{errorMessage}</p>}
      </div>
      <Home />
    </div>
  );
}
