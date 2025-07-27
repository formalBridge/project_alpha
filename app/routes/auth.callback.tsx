import { authCallbackLoader } from 'app/features/auth/loader';

export const loader = authCallbackLoader;

export default function AuthCallbackPage() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8', textAlign: 'center', padding: '50px' }}>
      <h1>Google 인증 처리 중...</h1>
      <p>잠시만 기다려 주세요.</p>
    </div>
  );
}
