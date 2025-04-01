import type { MetaFunction } from '@remix-run/cloudflare';

import { profileLoader } from 'app/features/profile/loader';
import Profile from 'app/features/profile/pages/profile';

export const meta: MetaFunction = () => {
  return [{ title: 'Post Index' }];
};

export default Profile;

export { profileLoader as loader };
