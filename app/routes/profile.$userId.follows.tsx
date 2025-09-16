import { MetaFunction } from '@remix-run/node';

import { followsAction } from 'app/features/profile/action';
import { followsLoader } from 'app/features/profile/loader';
import FollowPage from 'app/features/profile/pages/follows';

export const meta: MetaFunction = () => [{ title: '팔로우 목록' }];

export const loader = followsLoader;

export const action = followsAction;

export default FollowPage;
