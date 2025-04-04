import type { MetaFunction } from '@remix-run/cloudflare';

import { profileLoader } from 'app/features/profile/loader';
import Show from 'app/features/profile/pages/show';

export const meta: MetaFunction = () => {
  return [{ title: 'Post Index' }];
};

export default Show;

export { profileLoader as loader };
