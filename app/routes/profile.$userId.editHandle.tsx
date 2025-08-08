import type { MetaFunction } from '@remix-run/node';

import { editHandleAction } from 'app/features/profile/action';
import { editHandleLoader } from 'app/features/profile/loader';
import EditHandlePage from 'app/features/profile/pages/editHandle';

export const meta: MetaFunction = () => [{ title: '핸들 설정' }];

export const loader = editHandleLoader;
export const action = editHandleAction;

export default EditHandlePage;
