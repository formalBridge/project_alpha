import { Form, useActionData, useLoaderData } from '@remix-run/react';

import { editHandleLoader } from '../loader';
import styles from './editHandle.module.scss';

export default function EditHandlePage() {
  const loaderData = useLoaderData<typeof editHandleLoader>();
  const actionData = useActionData<{ error?: string }>();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>핸들 설정</h1>
      <Form method="post">
        <input type="text" name="handle" placeholder="핸들을 입력하세요" required className={styles.formInput} />
        <input type="hidden" name="userId" value={loaderData.userId} />
        {actionData?.error && <p className={styles.error}>{actionData.error}</p>}
        <button type="submit" className={styles.submitButton}>
          저장
        </button>
      </Form>
    </div>
  );
}
