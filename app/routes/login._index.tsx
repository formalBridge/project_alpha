import { MetaFunction } from '@remix-run/node';

import { loginLoader } from 'app/features/auth/loader';
import { LoginPage } from 'app/features/auth/pages';

export const loader = loginLoader;

export const meta: MetaFunction = () => [
  { title: '로그인 | MyApp' },
  { name: 'description', content: '구글 로그인 페이지입니다.' },
];

export default LoginPage;
