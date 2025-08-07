import { MetaFunction } from '@remix-run/node';

import { LoginErrorPage } from 'app/features/auth/pages/loginError';

export const meta: MetaFunction = () => [{ title: '구글 로그인 오류' }];

export default LoginErrorPage;
