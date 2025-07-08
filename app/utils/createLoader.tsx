import { PrismaClient } from '@prisma/client';
import { LoaderFunctionArgs } from '@remix-run/node';

import { prisma } from 'app/utils/prisma';

export default function createLoader<LoaderReturnType>(
  loader: (args: LoaderFunctionArgs & { db: PrismaClient }) => LoaderReturnType
) {
  return (args: LoaderFunctionArgs) => {
    return loader({ ...args, db: prisma });
  };
}
