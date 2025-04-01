import type { MetaFunction } from '@remix-run/cloudflare';

import AddTodaySong from 'app/features/profile/pages/addTodaySong';

export const meta: MetaFunction = () => {
  return [{ title: '오늘의 노래 수정' }];
};

export default AddTodaySong;
