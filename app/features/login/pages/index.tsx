import { useLoaderData } from '@remix-run/react';

export default function LoginPage() {
  const { clientId, redirectUri } = useLoaderData<typeof import('app/features/login/loader').loginLoader>();

  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid profile email');

  return (
    <div>
      <a href={googleAuthUrl.toString()}>
        <button> Sign in with Google </button>
      </a>
    </div>
  );
}
