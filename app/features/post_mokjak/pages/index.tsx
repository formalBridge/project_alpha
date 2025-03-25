import { Post } from '@prisma/client';
import { Await, Form, Link, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';

import { indexLoader } from 'app/features/post_mokjak/loader';

import styles from './index.module.scss';

export default function Index() {
  const { postsPromise } = useLoaderData<typeof indexLoader>();

  return (
    <div>
      <h1>Post Index</h1>
      <div>
        <Link to="create">create</Link>
        <div className={styles.postList}>
          <Suspense fallback={<div>Loading...</div>}>
            <Await resolve={postsPromise}>
              {(posts) => posts.map((post) => <PostItem key={post.id} post={post} />)}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

const PostItem = ({ post }: { post: Post }) => {
  return (
    <div className={styles.postItem}>
      <h2>
        #{post.id} {post.title}
      </h2>
      <div className={styles.buttonWrapper}>
        <Link to={`${post.id}/edit`}>수정</Link>
        <Form
          action={`${post.id}/destroy`}
          method="post"
          onSubmit={(event) => {
            const response = confirm('Please confirm you want to delete this record.');
            if (!response) {
              event.preventDefault();
            }
          }}
        >
          <button type="submit">삭제</button>
        </Form>
      </div>
    </div>
  );
};
