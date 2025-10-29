import { redirect } from '@remix-run/react';

import { getCurrentDBUser } from 'app/external/auth/jwt.server';
import createLoader from 'app/utils/createLoader';

export const feedLoader = createLoader(async ({ db, request }) => {
  const currentUser = await getCurrentDBUser(request, db);
  if (!currentUser) {
    throw redirect('profile/redirect');
  }

  const feedList = await db.feedData.findMany({
    where: { userId: currentUser.id },
    include: {
      memo: {
        include: {
          user: true,
          song: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return { feedList };
});
