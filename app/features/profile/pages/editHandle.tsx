import { Form, useActionData, useLoaderData, useNavigation } from '@remix-run/react';

import { editHandleLoader } from '../loader';
import styles from './editHandle.module.scss';
import { editHandleAction } from '../action';
import { useHandleValidation } from './useHandleValidation';

export default function EditHandlePage() {
  const loaderData = useLoaderData<typeof editHandleLoader>();
  const actionData = useActionData<typeof editHandleAction>();
  const nav = useNavigation();
  const isSubmitting = nav.state === 'submitting';

  const { handle, clientError, handleInputChange, handleInputBlur } = useHandleValidation();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>핸들 설정</h1>
      <section className={styles.card}>
        <Form method="post" replace>
          <label className={styles.labelWrap}>
            <label htmlFor="handle-input" className={styles.label}>
              핸들
            </label>
            <input
              type="text"
              name="handle"
              placeholder="핸들을 입력하세요"
              required
              className={styles.input}
              value={handle}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              aria-invalid={!!(clientError || actionData?.error)}
              aria-describedby="handle-error"
            />
          </label>

          <input type="hidden" name="userId" value={loaderData.userId} />

          <button type="submit" className={styles.button} disabled={isSubmitting}>
            {isSubmitting ? '저장 중...' : '저장'}
          </button>

          <div id="nickname-error" className={styles.errorContainer}>
            {(clientError || actionData?.error) && <p className={styles.error}>{clientError || actionData?.error}</p>}
          </div>
        </Form>
      </section>
    </div>
  );
}
