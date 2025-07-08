import { PrismaClient } from '@prisma/client';
import { ActionFunctionArgs } from '@remix-run/node';

import { prisma } from 'app/utils/prisma';

export default function createAction<ActionReturnType>(
  action: (args: ActionFunctionArgs & { db: PrismaClient }) => ActionReturnType
) {
  return (args: ActionFunctionArgs) => {
    return action({ ...args, db: prisma });
  };
}
