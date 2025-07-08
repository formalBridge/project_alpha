import type { MetaFunction } from '@remix-run/node';

import { profileLoader } from 'app/features/profile/loader';
import Show from 'app/features/profile/pages/show';

export const meta: MetaFunction = () => {
  return [{ title: 'Post Index' }];
};

export default Show;

export { profileLoader as loader };
