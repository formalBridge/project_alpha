//로그인이 필요한 페이지에 접근 시 authenticator.isAuthenticated() 등으로 리다이렉트 처리
import { LoaderFunctionArgs } from '@remix-run/node';

import { authenticator } from 'app/services/auth.server';
import createLoader from 'app/utils/createLoader';

//Google OAuth 콜백을 처리하는 로더 함수
// 인증 성공/실패에 따라 다른 경로로 리디렉션함.
export const authCallbackLoader = createLoader(async ({ request }) => {
  const user = await authenticator.authenticate('google', request);

  if (!user) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/login' },
    });
  }

  return new Response(null, {
    status: 302,
    headers: { Location: '/' },
  });
});

// 로그인 페이지의 로더 함수
// 사용자가 이미 로그인되어 있다면 대시보드로 리디렉션
// 아니면, Google OAuth 환경 변수 반환
export const loginLoader = createLoader(async ({ request }: LoaderFunctionArgs ) => {
  // 사용자가 이미 로그인되어 있는지 확인
  await authenticator.isAuthenticated(request, {
    successRedirect: '/dashboard',
  });

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error('Missing Google OAuth environment variables.');
  }

  return { clientId, redirectUri };
});
