import { useLoaderData } from '@remix-run/react';

import { showLoader } from '../loader';

export default function Show() {
  const { user } = useLoaderData<typeof showLoader>();

  if (!user) {
    return <div>없는 유저입니다.</div>;
  }

  return (
    <div>
      <h1>Profile Show</h1>
      <p>Welcome to the profile show page!</p>
      <p>{user.name}</p>
    </div>
  );
}
