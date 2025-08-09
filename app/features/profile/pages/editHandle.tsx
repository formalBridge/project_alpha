import { Form, useActionData, useLoaderData } from '@remix-run/react';

import { editHandleLoader } from '../loader';
import styles from './editHandle.module.scss';
import { editHandleAction } from '../action';
import { useHandleValidation } from './useHandleValidation';

export default function EditHandlePage() {
  const loaderData = useLoaderData<typeof editHandleLoader>();
  const actionData = useActionData<typeof editHandleAction>();

  const { handle, clientError, handleInputChange, handleInputBlur } = useHandleValidation();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>핸들 설정</h1>
      <Form method="post">
        <div className={styles.formRow}>
          <input
            type="text"
            name="handle"
            placeholder="핸들을 입력하세요"
            required
            className={styles.formInput}
            value={handle}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            aria-invalid={!!(clientError || actionData?.error)}
          />
          <button type="submit" className={styles.submitButton}>
            저장
          </button>
        </div>

        <input type="hidden" name="userId" value={loaderData.userId} />

        <div className={styles.errorContainer}>
          {(clientError || actionData?.error) && <p className={styles.error}>{clientError || actionData?.error}</p>}
        </div>
      </Form>
    </div>
  );
}
