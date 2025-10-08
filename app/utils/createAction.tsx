import { PrismaClient } from '@prisma/client';
import { ActionFunctionArgs } from '@remix-run/server-runtime';

import { prisma } from './getPrisma';

export default function createAction<ActionReturnType>(
  action: (args: ActionFunctionArgs & { db: PrismaClient }) => ActionReturnType
) {
  return (args: ActionFunctionArgs) => {
    return action({ ...args, db: prisma });
  };
}
