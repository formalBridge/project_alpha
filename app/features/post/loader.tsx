import { fetchPost, fetchPosts } from "~/features/post/services";
import createLoader from "~/utils/createLoader";

export const indexLoader = createLoader(async ({ db }) => {
  const postsPromise = fetchPosts(db)();
  return { postsPromise };
});

export const updateLoader = createLoader(async ({ db, params }) => {
  const post = await fetchPost(db)({ id: Number(params.postId) });
  return { post };
});
