import type { MetaFunction } from '@remix-run/node';

import { loginLoader } from 'app/features/login/loader';
import LoginPage from 'app/features/login/pages';

export const meta: MetaFunction = () => {
    return [{title: 'Login'}, {name: 'description', content: 'Google 계정으로 로그인'}]
};

export { loginLoader as loader };

export default LoginPage;