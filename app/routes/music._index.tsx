import type { MetaFunction } from '@remix-run/cloudflare';

import SearchMusic from 'app/features/music/pages/search';

export const meta: MetaFunction = () => {
  return [{ title: 'Music Home' }, { name: 'description', content: 'Search for music info' }];
};

export default function MusicIndex() {
  return <SearchMusic />;
}
