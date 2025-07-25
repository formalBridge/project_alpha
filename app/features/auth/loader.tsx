//로그인이 필요한 페이지에 접근 시 authenticator.isAuthenticated() 등으로 리다이렉트 처리
import { LoaderFunctionArgs } from '@remix-run/node';

import { authenticator } from 'app/external/auth/auth.server';
import { commitSession, getSession, getUserFromSession } from 'app/external/auth/session.server';
import createLoader from 'app/utils/createLoader';

// 로그인 페이지의 로더 함수
// 사용자가 이미 로그인되어 있다면 대시보드로 리디렉션
// 아니면, Google OAuth 환경 변수 반환
export const loginLoader = createLoader(async ({ request }: LoaderFunctionArgs ) => {
  // 사용자가 이미 로그인되어 있는지 확인
  await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  });

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error('Missing Google OAuth environment variables.');
  }

  return { clientId, redirectUri };
});

//Google OAuth 콜백을 처리하는 로더 함수
// 인증 성공/실패에 따라 다른 경로로 리디렉션함.
export const authCallbackLoader = createLoader(async ({ request }) => {
  const user = await authenticator.authenticate('google', request)
  .catch((error) => {
    console.error("❌ Auth failed", error);
    throw error; // 또는 /login 리다이렉트
  });

  if (!user) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/login' },
    });
  }

  const session = await getSession(request.headers.get("Cookie"));

  session.set('user', {
    accessToken: user.accessToken,
    name: user.name,
    email: user.email,
    handle: user.handle,
  });

  const cookie = await commitSession(session);

  return new Response(null, {
    status: 302,
    headers: { 
      Location: '/',
      'Set-Cookie': cookie,  
    },
  });
});

// Google 로그인 시작을 처리하는 로더
export const googleAuthLoader = createLoader(async ({ request }) => {
  return authenticator.authenticate('google', request);
});

// 사용자 accessToken을 반환하는 로더
export const accessTokenLoader = createLoader(async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  const accessToken = session.get('accessToken');

  if(!accessToken){
    throw new Response('Unauthorized', { status: 401 });
  }
    return { accessToken };
});

// 세션에서 accessToken을 꺼내 사용자 정보를 확인하는 로더
export const currentUserLoader = createLoader(async ({ request })=> {
  const user = await getUserFromSession(request);
  return { user };
})