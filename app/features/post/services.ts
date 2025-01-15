import { Post } from "@prisma/client";
import createService from "~/utils/createService";

export const fetchPosts = createService(async (db) => {
  return await db.post.findMany();
});

export const fetchPost = createService<{ id: number }, Post | null>(
  async (db, { id }) => {
    return await db.post.findUnique({
      where: { id },
    });
  }
);
