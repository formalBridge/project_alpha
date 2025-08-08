import type { MetaFunction } from '@remix-run/node';

import { addRankingSongAction } from 'app/features/profile/action';
import { editListLoader } from 'app/features/profile/loader';
import EditListPage from 'app/features/profile/pages/editList';

export const meta: MetaFunction = () => [{ title: '노래 랭킹 수정' }];

export const loader = editListLoader;
export const action = addRankingSongAction;

export default EditListPage;
