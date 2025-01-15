import { PrismaClient } from "@prisma/client";

export default function createService<
  ArgType extends Record<string, unknown>,
  ReturnType
>(serviceCallback: (db: PrismaClient, args: ArgType) => Promise<ReturnType>) {
  return (db: PrismaClient) => (args?: ArgType) => {
    return serviceCallback(db, args ?? ({} as ArgType));
  };
}
