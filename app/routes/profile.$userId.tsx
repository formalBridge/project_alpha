import type { MetaFunction } from '@remix-run/cloudflare';

import Show from 'app/features/profile/pages/show';

export const meta: MetaFunction = () => {
  return [{ title: 'Post Index' }];
};

export default Show;
