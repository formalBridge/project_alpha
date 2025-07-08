import type { MetaFunction } from '@remix-run/node';

import EditList from 'app/features/profile/pages/editList';

export const meta: MetaFunction = () => {
  return [{ title: '프로필 수정' }];
};

export default EditList;
