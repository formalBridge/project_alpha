import { useLoaderData, useActionData, useNavigation, Form } from '@remix-run/react';

import { settingsAction } from '../action';
import { settingsLoader } from '../loader';
import styles from './setting.module.scss';
import { useHandleValidation } from './useHandleValidation';
import { FormField } from '../components/FormField';

export default function SettingsPage() {
  const loaderData = useLoaderData<typeof settingsLoader>();
  const actionData = useActionData<typeof settingsAction>();
  const nav = useNavigation();
  const isSubmitting = nav.state === 'submitting';

  const { handle, clientError, handleInputChange, handleInputBlur } = useHandleValidation(loaderData.handle || '');

  const errorMessage = actionData?.error || clientError;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>계정 설정</h1>
      <section className={styles.card}>
        <Form method="post" replace className={styles.formGrid}>
          <img src={loaderData.avatarUrl} alt="프로필 사진" className={styles.avatar} />

          <FormField
            label="핸들"
            id="handle-input"
            name="handle"
            type="text"
            placeholder="수정할 핸들을 입력하세요."
            required
            value={handle}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            error={errorMessage}
          />
          <input type="hidden" name="userId" value={loaderData.userId} />
          <button type="submit" className={styles.button} disabled={isSubmitting || !!clientError}>
            {isSubmitting ? '저장 중…' : '저장'}
          </button>
        </Form>
      </section>
    </div>
  );
}
