import type { MetaFunction } from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';

import { currentUserLoader } from 'app/features/auth/loader';
import Home from 'app/features/home';
import { action } from 'app/features/profile/action';

export { action, currentUserLoader as loader };

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export default function Index() {
  const actionData = useActionData<typeof action>();
  const errorMessage = actionData?.error || null;
  const { user } = useLoaderData<typeof currentUserLoader>();

  return (
    <div>
      <div>
        <h3>사용자 프로필 검색</h3>
        <label htmlFor="search">사용자 핸들로 프로필을 검색하세요</label>
        <Form method="post" role="search">
          <input type="search" name="handle" id="search" />
          <button type="submit">검색</button>
        </Form>
        {errorMessage && <p>{errorMessage}</p>}
      </div>

      {user?.accessToken ? (
        <div>
          <h4> 로그인 완료 </h4>
          <p>name: {user.name}</p>
          <p>email: {user.email}</p>
          <p>handle: {user.handle}</p>
        </div>
      ) : (
        <form method="post" action="/auth/google">
          <button type="submit">Google 계정으로 로그인</button>
        </form>
      )}
      <Home />
    </div>
  );
}
