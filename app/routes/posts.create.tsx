import type { MetaFunction } from '@remix-run/node';

import { insertAction } from 'app/features/post/action';
import Create from 'app/features/post/pages/create';

export const meta: MetaFunction = () => {
  return [{ title: 'Post Create' }];
};

export const action = insertAction;

export default Create;
