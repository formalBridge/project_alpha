import { PrismaClient } from '@prisma/client';
import { ActionFunctionArgs } from '@remix-run/node';

export default function createAction<ActionReturnType>(
  action: (args: ActionFunctionArgs & { db: PrismaClient }) => ActionReturnType
) {
  return (args: ActionFunctionArgs) => {
    const prisma = new PrismaClient();
    return action({ ...args, db: prisma });
  };
}
