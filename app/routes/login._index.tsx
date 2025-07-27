import type { MetaFunction } from '@remix-run/node';

import { loginLoader } from 'app/features/auth/loader';
import LoginPage from 'app/features/auth/pages';

export const meta: MetaFunction = () => {
  return [{ title: 'Login' }, { name: 'description', content: 'Google 계정으로 로그인' }];
};

export { loginLoader as loader };

export default LoginPage;
