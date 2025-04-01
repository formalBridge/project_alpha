import type { MetaFunction } from '@remix-run/cloudflare';

import { loader as musicLoader } from 'app/features/music/loader'; // 경로 수정
import SearchMusic from 'app/features/music/pages/search'; // 경로 수정

export const meta: MetaFunction = () => {
  return [{ title: 'Music Search' }, { name: 'description', content: 'Search for music info' }];
};

export const loader = musicLoader;

export default SearchMusic;
