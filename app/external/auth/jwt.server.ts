import { parse } from 'cookie';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export interface JwtPayload {
  id: number;
  name: string;
}

export const createJwt = async (payload: Record<string, unknown>) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
};

export const verifyJwt: (token: string) => Promise<JwtPayload | null> = async (token) => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const { id, name } = payload;
    if (typeof id === 'number' && typeof name === 'string') {
      return { id, name };
    }
    return null;
  } catch (e) {
    console.error('JWT verification failed:', e);
    return null;
  }
};

export async function getCurrentUser(request: Request) {
  const cookieHeader = request.headers.get('Cookie') || '';
  const cookies = parse(cookieHeader);
  const jwt = cookies.jwt;

  if (!jwt) return null;

  const user = await verifyJwt(jwt);
  return user;
}
