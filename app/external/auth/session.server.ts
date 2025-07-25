// createCookieSessionStorage로 Remix 세션 처리 담당 (getSession, commitSession, destroySession)
import { createCookieSessionStorage } from '@remix-run/node';

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET is required');
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === 'production',
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

// 사용자 세션에서 accessToken 꺼내는 함수
export async function getUserFromSession(request: Request) {
  const session = await getSession(request.headers.get('Cookie'));
  const user = session.get('user');

  if (!user) return null;

  return user;
}
