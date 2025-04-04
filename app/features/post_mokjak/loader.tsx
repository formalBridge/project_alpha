import { fetchPost, fetchPosts } from 'app/features/post_mokjak/services';
import createLoader from 'app/utils/createLoader';

export const indexLoader = createLoader(async ({ db }) => {
  const postsPromise = fetchPosts(db)();
  return { postsPromise };
});

export const updateLoader = createLoader(async ({ db, params }) => {
  const post = await fetchPost(db)({ id: Number(params.postId) });
  return { post };
});
