import type { MetaFunction } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';

import Home from 'app/features/home';
import { action } from 'app/features/profile/action';

export { action };

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
        <label htmlFor="search">사용자 핸들로 프로필을 검색하세요</label>
        <Form method="post" role="search">
          <input type="search" name="handle" id="search" />
          <button type="submit">검색</button>
        </Form>
        {errorMessage && <p>{errorMessage}</p>}
      </div>
      <Home />
    </div>
  );
}
