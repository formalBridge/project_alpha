import type { MetaFunction } from '@remix-run/cloudflare';

import EditList from 'app/features/profile/pages/editList';

export const meta: MetaFunction = () => {
  return [{ title: '프로필 수정' }];
};

export default EditList;
