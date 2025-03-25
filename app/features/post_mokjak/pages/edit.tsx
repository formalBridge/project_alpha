import { Form, useActionData, useLoaderData } from '@remix-run/react';

import { updateAction } from 'app/features/post_mokjak/action';
import { updateLoader } from 'app/features/post_mokjak/loader';

import styles from './edit.module.scss';

export default function Edit() {
  const { post } = useLoaderData<typeof updateLoader>();
  const actionData = useActionData<typeof updateAction>();

  return (
    <div className={styles.root}>
      <h1>Post Update</h1>
      {actionData && <p>{actionData.error[0].message}</p>}
      <Form method="post" className={styles.formContainer}>
        <input type="text" name="title" placeholder="Title" defaultValue={post?.title} />
        <textarea name="content" placeholder="Content">
          {post?.content}
        </textarea>
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
