import type { MetaFunction } from '@remix-run/cloudflare';

// import { loader as musicLoader } from 'app/features/music/loader';
import SearchMusic from 'app/features/music/pages/search';
// import SearchMusic from './music.search';

export const meta: MetaFunction = () => {
  return [{ title: 'Music Home' }, { name: 'description', content: 'Search for music info' }];
};

export default function MusicIndex() {
  return <SearchMusic />;
}

// export const loader = musicLoader;
