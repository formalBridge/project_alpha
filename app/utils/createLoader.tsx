import { PrismaClient } from '@prisma/client';
import { LoaderFunctionArgs } from '@remix-run/node';

export default function createLoader<LoaderReturnType>(
  loader: (args: LoaderFunctionArgs & { db: PrismaClient }) => LoaderReturnType
) {
  return (args: LoaderFunctionArgs) => {
    const prisma = new PrismaClient();
    return loader({ ...args, db: prisma });
  };
}
