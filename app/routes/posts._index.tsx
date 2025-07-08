import type { MetaFunction } from '@remix-run/node';

import { indexLoader } from 'app/features/post/loader';
import Index from 'app/features/post/pages';

export const meta: MetaFunction = () => {
  return [{ title: 'Post Index' }];
};

export { indexLoader as loader };

export default Index;
