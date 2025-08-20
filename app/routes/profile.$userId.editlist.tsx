import type { MetaFunction } from '@remix-run/node';

import EditList from 'app/features/profile/pages/editList';
import { ErrorBoundary } from 'app/root';

export const meta: MetaFunction = () => {
  return [{ title: '프로필 수정' }];
};

export { ErrorBoundary };

export default EditList;
