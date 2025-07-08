import type { MetaFunction } from '@remix-run/node';

import Home from 'app/features/home';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export default function Index() {
  return <Home />;
}
