import type { MetaFunction } from '@remix-run/cloudflare';

import { updateAction } from 'app/features/post/action';
import { updateLoader } from 'app/features/post/loader';
import Edit from 'app/features/post/pages/edit';

export const meta: MetaFunction = () => {
  return [{ title: 'Post Edit' }];
};

export const loader = updateLoader;

export const action = updateAction;

export default Edit;
