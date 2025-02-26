import { User } from '@prisma/client';

import createService from 'app/utils/createService';

export const fetchUser = createService<{ id: number }, User | null>(async (db, { id }) => {
  return await db.user.findFirst({ where: { id: id } });
});
