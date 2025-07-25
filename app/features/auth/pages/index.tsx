import { useLoaderData } from '@remix-run/react';

import type { loginLoader as loginLoaderType } from 'app/features/auth/loader'

export default function LoginPage() {
  const { clientId, redirectUri } = useLoaderData<typeof loginLoaderType>();

  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid profile email');

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8', padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>로그인</h1>

      {/* Google 로그인 시작을 위한 폼 (POST 요청을 /auth/google로 보냄) */}
      <form method="post" action="/auth/google">
        <button
          type="submit"
          style={{
            padding: '12px 20px',
            backgroundColor: '#4285F4',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'background-color 0.3s ease',
            textDecoration: 'none'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#357ae8')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4285F4')}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2045C17.64 8.5665 17.5845 7.9525 17.4775 7.3695H9V10.7965H13.8825C13.6725 11.9015 13.0095 12.8715 12.0075 13.5355V15.8205H14.9075C16.6895 14.1865 17.64 11.8575 17.64 9.2045Z" fill="#4285F4"/>
            <path d="M9 18C11.43 18 13.467 17.199 14.907 15.8205L12.007 13.5355C11.171 14.0925 10.138 14.4365 9 14.4365C6.936 14.4365 5.187 13.0645 4.5495 11.2415H1.5625V13.5965C3.0035 16.3295 5.8645 18 9 18Z" fill="#34A853"/>
            <path d="M4.5495 11.2415C4.3545 10.6785 4.2405 10.0545 4.2405 9.3665C4.2405 8.6785 4.3545 8.0545 4.5495 7.4915V5.2065H1.5625C0.8445 6.6435 0.4205 7.9525 0.4205 9.3665C0.4205 10.7805 0.8445 12.0895 1.5625 13.5265L4.5495 11.2415Z" fill="#FBBC05"/>
            <path d="M9 3.5635C10.086 3.5635 11.082 3.9315 11.8845 4.6715L14.9645 1.7955C13.4675 0.6555 11.43 0 9 0C5.8645 0 3.0035 1.6705 1.5625 4.4035L4.5495 6.6885C5.187 4.8655 6.936 3.5635 9 3.5635Z" fill="#EA4335"/>
          </svg>
          Google 계정으로 로그인
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
        이 페이지는 Google OAuth2 로그인 흐름을 시작합니다.
      </p>
    </div>
  );
}
