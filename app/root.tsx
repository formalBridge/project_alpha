import type { LinksFunction } from '@remix-run/node';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useNavigation } from '@remix-run/react';
import NProgress from 'nprogress';
import { useEffect } from 'react';

import nProgressStyles from 'nprogress/nprogress.css?url';

import 'styles/main.scss';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
  {
    rel: 'icon',
    href: '/favicon.ico',
  },
  { rel: 'stylesheet', href: nProgressStyles },
];

export const meta = () => [
  { title: '두둠 음악' },
  { name: 'description', content: '스쳐 가는 멜로디, 머무는 감정들. 음악을 쉽게 기록해 보세요.' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ProgressBar />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ProgressBar() {
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === 'loading' || navigation.state === 'submitting') {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [navigation.state]);

  return null;
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <html>
      <head>
        <title>Error</title>
      </head>
      <body>
        <h1>Oops! Something went wrong.</h1>
        <p>{error?.message}</p>
        <Scripts />
      </body>
    </html>
  );
}
