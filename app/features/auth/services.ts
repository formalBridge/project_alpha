import { PrismaClient, User as PrismaUser } from '@prisma/client';

import createService from 'app/utils/createService';

interface FindOrCreateUserInput extends Record<string, unknown> {
  email: string;
  googleId: string;
  name: string;
  handle: string;
}

export const findOrCreateUser = createService<FindOrCreateUserInput, PrismaUser>(async (db: PrismaClient, args) => {
  const { email, googleId, name, handle } = args;

  let user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        email,
        googleId,
        name,
        handle,
      },
    });
  } else {
    user = await db.user.update({
      where: { id: user.id },
      data: {
        googleId,
        name,
      },
    });
  }

  return user;
});

export const getUserById = createService<{ userId: string }, PrismaUser | null>(
  async (db: PrismaClient, args: { userId: string }) => {
    const user = await db.user.findUnique({
      where: { id: parseInt(args.userId) },
    });
    return user;
  }
);

export const checkUserExistsByEmail = createService<{ email: string }, boolean>(
  async (db: PrismaClient, args: { email: string }) => {
    const count = await db.user.count({
      where: { email: args.email },
    });
    return count > 0;
  }
);
