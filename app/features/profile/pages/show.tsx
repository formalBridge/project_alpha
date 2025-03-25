import { useLoaderData } from '@remix-run/react';

import { showLoader } from '../loader';

export default function Show() {
  const { user } = useLoaderData<typeof showLoader>();

  const currentUser = user ?? { id: 0, name: 'Guest' };

  return (
    <div>
      <div>
        <img></img>
        <div>
          <p>{currentUser.name}</p>
          <p>@han_dle</p>
        </div>
      </div>
      <div>
        <div>
          <p>오늘의 추천곡</p>
          <div>
            <img></img>
            <div>
              <p>노래 제목</p>
              <p>가수 이름</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
